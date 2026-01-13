import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ArrowLeft, Check, X, Users } from 'lucide-react';

const FriendRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('received');

  useEffect(() => {
    // Listen to received requests
    const receivedQuery = query(
      collection(db, 'friendRequests'),
      where('toUserId', '==', user.id),
      where('status', '==', 'pending')
    );

    const unsubReceived = onSnapshot(receivedQuery, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReceivedRequests(requests);
    });

    // Listen to sent requests
    const sentQuery = query(
      collection(db, 'friendRequests'),
      where('fromUserId', '==', user.id),
      where('status', '==', 'pending')
    );

    const unsubSent = onSnapshot(sentQuery, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSentRequests(requests);
    });

    return () => {
      unsubReceived();
      unsubSent();
    };
  }, [user.id]);

  const acceptRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, 'friendRequests', requestId), {
        status: 'accepted'
      });
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const declineRequest = async (requestId) => {
    try {
      await deleteDoc(doc(db, 'friendRequests', requestId));
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  const cancelRequest = async (requestId) => {
    try {
      await deleteDoc(doc(db, 'friendRequests', requestId));
    } catch (error) {
      console.error('Error canceling request:', error);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={styles.headerTitle}>Friend Requests</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('received')}
          style={{
            ...styles.tab,
            ...(activeTab === 'received' ? styles.activeTab : {})
          }}
        >
          Received ({receivedRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          style={{
            ...styles.tab,
            ...(activeTab === 'sent' ? styles.activeTab : {})
          }}
        >
          Sent ({sentRequests.length})
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'received' ? (
          receivedRequests.length === 0 ? (
            <div style={styles.emptyState}>
              <Users size={64} color="#cbd5e0" />
              <h3 style={styles.emptyTitle}>No pending requests</h3>
              <p style={styles.emptyText}>You're all caught up!</p>
            </div>
          ) : (
            <div style={styles.requestsList}>
              {receivedRequests.map((request) => (
                <div key={request.id} style={styles.requestCard}>
                  <div style={styles.requestInfo}>
                    <div style={styles.requestAvatar}>
                      {request.fromUserName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={styles.requestName}>{request.fromUserName}</h3>
                      <p style={styles.requestTime}>
                        {new Date(request.createdAt?.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div style={styles.requestActions}>
                    <button
                      onClick={() => acceptRequest(request.id)}
                      style={styles.acceptButton}
                    >
                      <Check size={18} />
                      Accept
                    </button>
                    <button
                      onClick={() => declineRequest(request.id)}
                      style={styles.declineButton}
                    >
                      <X size={18} />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          sentRequests.length === 0 ? (
            <div style={styles.emptyState}>
              <Users size={64} color="#cbd5e0" />
              <h3 style={styles.emptyTitle}>No pending requests</h3>
              <p style={styles.emptyText}>Send friend requests from the home feed!</p>
            </div>
          ) : (
            <div style={styles.requestsList}>
              {sentRequests.map((request) => (
                <div key={request.id} style={styles.requestCard}>
                  <div style={styles.requestInfo}>
                    <div style={styles.requestAvatar}>
                      {request.toUserName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={styles.requestName}>{request.toUserName}</h3>
                      <p style={styles.requestTime}>
                        Sent {new Date(request.createdAt?.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => cancelRequest(request.id)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f7fafc'
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
  tabs: {
    background: 'white',
    display: 'flex',
    borderBottom: '2px solid #e2e8f0'
  },
  tab: {
    flex: 1,
    padding: '16px',
    background: 'none',
    border: 'none',
    fontSize: '15px',
    fontWeight: '600',
    color: '#718096',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s'
  },
  activeTab: {
    color: '#667eea',
    borderBottomColor: '#667eea'
  },
  content: {
    padding: '24px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  requestCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    gap: '16px',
    flexWrap: 'wrap'
  },
  requestInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    minWidth: '200px'
  },
  requestAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px',
    fontWeight: '700'
  },
  requestName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a202c',
    margin: '0 0 4px 0'
  },
  requestTime: {
    fontSize: '13px',
    color: '#718096',
    margin: 0
  },
  requestActions: {
    display: 'flex',
    gap: '8px'
  },
  acceptButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  declineButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#f56565',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  cancelButton: {
    padding: '8px 16px',
    background: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 32px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '16px 0 8px 0'
  },
  emptyText: {
    fontSize: '14px',
    color: '#718096',
    margin: 0
  }
};

export default FriendRequests;
