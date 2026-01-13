import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ArrowLeft, Wallet as WalletIcon, Plus, History, TrendingUp, DollarSign } from 'lucide-react';

const Wallet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to wallet balance
    const walletRef = doc(db, 'wallets', user.id);
    const unsubWallet = onSnapshot(walletRef, (docSnap) => {
      if (docSnap.exists()) {
        setBalance(docSnap.data().balance || 0);
      } else {
        // Create wallet if doesn't exist
        updateDoc(walletRef, { balance: 0, userId: user.id }).catch(() => {});
      }
      setLoading(false);
    });

    // Listen to transactions
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.id)
    );

    const unsubTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const txns = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      txns.sort((a, b) => b.timestamp - a.timestamp);
      setTransactions(txns);
    });

    return () => {
      unsubWallet();
      unsubTransactions();
    };
  }, [user.id]);

  const addMoney = async (e) => {
    e.preventDefault();
    const addAmount = parseFloat(amount);
    
    if (!addAmount || addAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: 'rzp_test_YOUR_KEY_ID', // Replace with your Razorpay Key ID
        amount: addAmount * 100, // Amount in paise (₹1 = 100 paise)
        currency: 'INR',
        name: 'Friend Finder',
        description: 'Add Money to Wallet',
        image: 'https://your-logo-url.com/logo.png', // Optional: Your logo
        handler: async function (response) {
          // Payment successful
          try {
            // Update wallet balance
            const walletRef = doc(db, 'wallets', user.id);
            await updateDoc(walletRef, {
              balance: balance + addAmount
            });

            // Record transaction
            await addDoc(collection(db, 'transactions'), {
              userId: user.id,
              type: 'credit',
              amount: addAmount,
              description: 'Added money to wallet via Razorpay',
              paymentId: response.razorpay_payment_id,
              timestamp: serverTimestamp()
            });

            setAmount('');
            setShowAddMoney(false);
            alert(`Successfully added ₹${addAmount} to your wallet!`);
          } catch (error) {
            console.error('Error updating wallet:', error);
            alert('Payment successful but failed to update wallet. Contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#667eea'
        },
        modal: {
          ondismiss: function() {
            alert('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    };

    script.onerror = () => {
      alert('Failed to load payment gateway. Please try again.');
    };
  };

  const getTransactionIcon = (type) => {
    return type === 'credit' ? '💰' : '💸';
  };

  const getTransactionColor = (type) => {
    return type === 'credit' ? '#48bb78' : '#f56565';
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={styles.headerTitle}>My Wallet</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Balance Card */}
      <div style={styles.content}>
        <div style={styles.balanceCard}>
          <div style={styles.balanceIcon}>
            <WalletIcon size={40} color="#667eea" />
          </div>
          <p style={styles.balanceLabel}>Current Balance</p>
          <h1 style={styles.balanceAmount}>₹{balance.toFixed(2)}</h1>
          <button onClick={() => setShowAddMoney(true)} style={styles.addMoneyButton}>
            <Plus size={20} />
            Add Money
          </button>
        </div>

        {/* Quick Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <TrendingUp size={24} color="#48bb78" />
            </div>
            <div>
              <p style={styles.statLabel}>Total Added</p>
              <p style={styles.statValue}>
                ₹{transactions
                  .filter(t => t.type === 'credit')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <DollarSign size={24} color="#f56565" />
            </div>
            <div>
              <p style={styles.statLabel}>Total Spent</p>
              <p style={styles.statValue}>
                ₹{transactions
                  .filter(t => t.type === 'debit')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Transactions History */}
        <div style={styles.transactionsSection}>
          <div style={styles.sectionHeader}>
            <History size={20} color="#4a5568" />
            <h3 style={styles.sectionTitle}>Transaction History</h3>
          </div>

          {transactions.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No transactions yet</p>
            </div>
          ) : (
            <div style={styles.transactionsList}>
              {transactions.map((txn) => (
                <div key={txn.id} style={styles.transactionCard}>
                  <div style={styles.transactionIcon}>
                    {getTransactionIcon(txn.type)}
                  </div>
                  <div style={styles.transactionInfo}>
                    <p style={styles.transactionDesc}>{txn.description}</p>
                    <p style={styles.transactionDate}>
                      {txn.timestamp.toLocaleDateString()} at {txn.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <p
                    style={{
                      ...styles.transactionAmount,
                      color: getTransactionColor(txn.type)
                    }}
                  >
                    {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div style={styles.modal} onClick={() => setShowAddMoney(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Add Money to Wallet</h3>
            <p style={styles.modalSubtitle}>Pay securely via UPI, Cards, or Net Banking</p>
            <form onSubmit={addMoney} style={styles.modalForm}>
              <label style={styles.modalLabel}>Amount (₹)</label>
              <input
                type="number"
                step="1"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                style={styles.modalInput}
                required
              />
              <div style={styles.quickAmounts}>
                {[100, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    style={styles.quickAmountButton}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowAddMoney(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  Pay via Razorpay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f7fafc'
  },
  loadingContainer: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  header: {
    background: 'white',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: '#f7fafc',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    color: '#4a5568'
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  content: {
    padding: '24px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  balanceCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    padding: '32px',
    textAlign: 'center',
    color: 'white',
    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
    marginBottom: '24px'
  },
  balanceIcon: {
    marginBottom: '16px'
  },
  balanceLabel: {
    fontSize: '14px',
    opacity: 0.9,
    margin: '0 0 8px 0'
  },
  balanceAmount: {
    fontSize: '48px',
    fontWeight: '700',
    margin: '0 0 24px 0'
  },
  addMoneyButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 32px',
    background: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#f7fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statLabel: {
    fontSize: '13px',
    color: '#718096',
    margin: '0 0 4px 0'
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  transactionsSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  transactionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#f7fafc',
    borderRadius: '8px'
  },
  transactionIcon: {
    fontSize: '24px'
  },
  transactionInfo: {
    flex: 1
  },
  transactionDesc: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a202c',
    margin: '0 0 4px 0'
  },
  transactionDate: {
    fontSize: '12px',
    color: '#718096',
    margin: 0
  },
  transactionAmount: {
    fontSize: '16px',
    fontWeight: '700'
  },
  emptyState: {
    textAlign: 'center',
    padding: '32px',
    color: '#a0aec0'
  },
  emptyText: {
    margin: 0
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '400px',
    width: '90%'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 8px 0'
  },
  modalSubtitle: {
    fontSize: '14px',
    color: '#718096',
    margin: '0 0 24px 0'
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  modalLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a202c'
  },
  modalInput: {
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  },
  quickAmounts: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px'
  },
  quickAmountButton: {
    padding: '8px',
    background: '#f7fafc',
    color: '#667eea',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px'
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    background: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  submitButton: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  }
};

export default Wallet;
