import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ArrowLeft, MessageCircle, Video, Heart, MapPin, Calendar, Edit, DollarSign } from 'lucide-react';

const Profile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendRequestStatus, setFriendRequestStatus] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState(''); // 'chat' or 'video'
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    fetchProfile();
    checkFriendRequestStatus();
    fetchUserBalance();
  }, [userId]);

  const fetchUserBalance = async () => {
    try {
      const walletDoc = await getDoc(doc(db, 'wallets', user.id));
      if (walletDoc.exists()) {
        setUserBalance(walletDoc.data().balance || 0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setProfile({ id: userDoc.id, ...userDoc.data() });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const checkFriendRequestStatus = async () => {
    try {
      // Check if there's already a friend request
      const requestsRef = collection(db, 'friendRequests');
      const q = query(
        requestsRef,
        where('fromUserId', '==', user.id),
        where('toUserId', '==', userId)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        setFriendRequestStatus(snapshot.docs[0].data().status);
      }

      // Check reverse
      const q2 = query(
        requestsRef,
        where('fromUserId', '==', userId),
        where('toUserId', '==', user.id)
      );
      const snapshot2 = await getDocs(q2);
      
      if (!snapshot2.empty) {
        setFriendRequestStatus(snapshot2.docs[0].data().status);
      }
    } catch (error) {
      console.error('Error checking friend request:', error);
    }
  };

  const sendFriendRequest = async () => {
    try {
      await addDoc(collection(db, 'friendRequests'), {
        fromUserId: user.id,
        fromUserName: user.name,
        toUserId: userId,
        toUserName: profile.name,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setFriendRequestStatus('pending');
      alert('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
    }
  };

  const handleConnect = async (type) => {
    if (friendRequestStatus !== 'accepted') {
      sendFriendRequest();
      return;
    }

    // Check if payment is needed (for providers with rates set)
    const rate = type === 'chat' ? profile.chatRate : profile.videoRate;
    
    if (profile.userType === 'provider' && rate && rate > 0) {
      // Check balance
      if (userBalance < rate) {
        alert(`Insufficient balance! You need ₹${rate} but have ₹${userBalance.toFixed(2)}. Please add money to your wallet.`);
        navigate('/wallet');
        return;
      }
      
      // Show payment confirmation
      setPaymentType(type);
      setShowPaymentModal(true);
    } else {
      // Free connection
      await createConnection(type);
    }
  };

  const createConnection = async (type) => {
    try {
      // Find existing booking/connection
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('userId', '==', user.id),
        where('providerId', '==', userId)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const bookingId = snapshot.docs[0].id;
        if (type === 'chat') {
          navigate(`/chat/${bookingId}`);
        } else {
          navigate(`/video-call/${bookingId}`);
        }
      } else {
        // Create new booking
        const booking = await addDoc(bookingsRef, {
          userId: user.id,
          userName: user.name,
          providerId: userId,
          providerName: profile.name,
          status: 'active',
          createdAt: serverTimestamp()
        });
        
        if (type === 'chat') {
          navigate(`/chat/${booking.id}`);
        } else {
          navigate(`/video-call/${booking.id}`);
        }
      }
    } catch (error) {
      console.error('Error creating connection:', error);
      alert('Failed to connect. Please try again.');
    }
  };

  const processPayment = async () => {
    const rate = paymentType === 'chat' ? profile.chatRate : profile.videoRate;
    
    try {
      // Deduct from user wallet
      const userWalletRef = doc(db, 'wallets', user.id);
      await updateDoc(userWalletRef, {
        balance: userBalance - rate
      });

      // Add to provider wallet
      const providerWalletRef = doc(db, 'wallets', userId);
      const providerWallet = await getDoc(providerWalletRef);
      const providerBalance = providerWallet.exists() ? providerWallet.data().balance || 0 : 0;
      await updateDoc(providerWalletRef, {
        balance: providerBalance + rate,
        userId: userId
      });

      // Record transactions
      await addDoc(collection(db, 'transactions'), {
        userId: user.id,
        type: 'debit',
        amount: rate,
        description: `Payment to ${profile.name} for ${paymentType} session`,
        timestamp: serverTimestamp()
      });

      await addDoc(collection(db, 'transactions'), {
        userId: userId,
        type: 'credit',
        amount: rate,
        description: `Payment from ${user.name} for ${paymentType} session`,
        timestamp: serverTimestamp()
      });

      setShowPaymentModal(false);
      await createConnection(paymentType);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.container}>
        <div style={styles.errorMessage}>Profile not found</div>
      </div>
    );
  }

  const isOwnProfile = user.id === userId;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={20} />
        </button>
        {isOwnProfile && (
          <button onClick={() => navigate('/edit-profile')} style={styles.editButton}>
            <Edit size={18} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div style={styles.content}>
        <div style={styles.profileCard}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              {profile.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {profile.isOnline && <div style={styles.onlineBadge}></div>}
          </div>

          <h1 style={styles.name}>{profile.name}</h1>
          <p style={styles.email}>{profile.email}</p>
          <div style={styles.userTypeBadge}>
            {profile.userType === 'provider' ? '🌟 Friend' : '👤 User'}
          </div>

          {profile.bio && (
            <p style={styles.bio}>{profile.bio}</p>
          )}

          {profile.location && (
            <div style={styles.infoRow}>
              <MapPin size={16} color="#718096" />
              <span>{profile.location}</span>
            </div>
          )}

          <div style={styles.infoRow}>
            <Calendar size={16} color="#718096" />
            <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
          </div>

          {profile.interests && profile.interests.length > 0 && (
            <div style={styles.interestsSection}>
              <h3 style={styles.sectionTitle}>Interests</h3>
              <div style={styles.interestsTags}>
                {profile.interests.map((interest, index) => (
                  <span key={index} style={styles.interestTag}>
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Display Rates for Providers */}
          {profile.userType === 'provider' && (profile.chatRate || profile.videoRate) && (
            <div style={styles.ratesSection}>
              <h3 style={styles.sectionTitle}>
                <DollarSign size={18} />
                Session Rates
              </h3>
              <div style={styles.ratesGrid}>
                {profile.chatRate > 0 && (
                  <div style={styles.rateCard}>
                    <MessageCircle size={20} color="#667eea" />
                    <div>
                      <div style={styles.rateLabel}>Chat Session</div>
                      <div style={styles.rateAmount}>₹{profile.chatRate}</div>
                    </div>
                  </div>
                )}
                {profile.videoRate > 0 && (
                  <div style={styles.rateCard}>
                    <Video size={20} color="#667eea" />
                    <div>
                      <div style={styles.rateLabel}>Video Call</div>
                      <div style={styles.rateAmount}>₹{profile.videoRate}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isOwnProfile && (
            <div style={styles.actions}>
              {friendRequestStatus === 'accepted' ? (
                <>
                  <button onClick={() => handleConnect('chat')} style={styles.primaryButton}>
                    <MessageCircle size={18} />
                    {profile.chatRate > 0 ? `Pay ₹${profile.chatRate} & Chat` : 'Message'}
                  </button>
                  <button onClick={() => handleConnect('video')} style={styles.secondaryButton}>
                    <Video size={18} />
                    {profile.videoRate > 0 ? `Pay ₹${profile.videoRate} & Video` : 'Video Call'}
                  </button>
                </>
              ) : friendRequestStatus === 'pending' ? (
                <button disabled style={styles.disabledButton}>
                  Request Sent
                </button>
              ) : (
                <button onClick={sendFriendRequest} style={styles.primaryButton}>
                  <Heart size={18} />
                  Send Friend Request
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <div style={styles.modalOverlay} onClick={() => setShowPaymentModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Confirm Payment</h2>
            <div style={styles.modalContent}>
              <p style={styles.modalText}>
                You are about to pay <strong>₹{paymentType === 'chat' ? profile.chatRate : profile.videoRate}</strong> to {profile.name} for a {paymentType} session.
              </p>
              <div style={styles.balanceInfo}>
                <span>Your Balance:</span>
                <span style={styles.balanceAmount}>₹{userBalance.toFixed(2)}</span>
              </div>
              <div style={styles.balanceInfo}>
                <span>After Payment:</span>
                <span style={styles.balanceAmount}>
                  ₹{(userBalance - (paymentType === 'chat' ? profile.chatRate : profile.videoRate)).toFixed(2)}
                </span>
              </div>
            </div>
            <div style={styles.modalActions}>
              <button onClick={() => setShowPaymentModal(false)} style={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={processPayment} style={styles.confirmButton}>
                Confirm & Pay
              </button>
            </div>
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
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  content: {
    padding: '32px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  profileCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  avatarContainer: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '16px'
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '48px',
    fontWeight: '700',
    margin: '0 auto'
  },
  onlineBadge: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    width: '24px',
    height: '24px',
    background: '#48bb78',
    border: '4px solid white',
    borderRadius: '50%'
  },
  name: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '8px 0'
  },
  email: {
    fontSize: '14px',
    color: '#718096',
    margin: '0 0 12px 0'
  },
  userTypeBadge: {
    display: 'inline-block',
    padding: '6px 16px',
    background: '#f7fafc',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '16px'
  },
  bio: {
    fontSize: '15px',
    color: '#4a5568',
    lineHeight: '1.6',
    margin: '16px 0',
    textAlign: 'center'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#718096',
    margin: '8px 0'
  },
  interestsSection: {
    marginTop: '24px',
    textAlign: 'left'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 12px 0'
  },
  interestsTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  interestTag: {
    padding: '6px 12px',
    background: '#e6fffa',
    color: '#047857',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: '500'
  },
  ratesSection: {
    marginTop: '24px',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    color: 'white'
  },
  ratesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '12px'
  },
  rateCard: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  rateLabel: {
    fontSize: '12px',
    opacity: '0.9',
    marginBottom: '4px'
  },
  rateAmount: {
    fontSize: '20px',
    fontWeight: '700'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  primaryButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px'
  },
  secondaryButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px'
  },
  disabledButton: {
    flex: 1,
    padding: '12px',
    background: '#e2e8f0',
    color: '#a0aec0',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'not-allowed'
  },
  errorMessage: {
    textAlign: 'center',
    padding: '32px',
    fontSize: '16px',
    color: '#718096'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '450px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '20px',
    textAlign: 'center'
  },
  modalContent: {
    marginBottom: '24px'
  },
  modalText: {
    fontSize: '16px',
    color: '#4a5568',
    lineHeight: '1.6',
    marginBottom: '20px',
    textAlign: 'center'
  },
  balanceInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    background: '#f7fafc',
    borderRadius: '8px',
    marginBottom: '8px',
    fontSize: '15px',
    color: '#2d3748'
  },
  balanceAmount: {
    fontWeight: '700',
    color: '#667eea'
  },
  modalActions: {
    display: 'flex',
    gap: '12px'
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
    fontSize: '15px'
  },
  confirmButton: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px'
  }
};

export default Profile;
