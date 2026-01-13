import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, Video, LogOut, User, Search, Filter, Bell, UserPlus, Wallet as WalletIcon } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('all');
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  // Fetch all providers (friends) in real-time
  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('userType', '==', 'provider'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const providersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProviders(providersData);
      setFilteredProviders(providersData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fetch pending friend requests count
  useEffect(() => {
    const requestsQuery = query(
      collection(db, 'friendRequests'),
      where('toUserId', '==', user.id),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      setPendingRequestsCount(snapshot.docs.length);
    });

    return unsubscribe;
  }, [user.id]);

  // Filter providers based on search and interests
  useEffect(() => {
    let filtered = providers;

    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedInterest !== 'all') {
      filtered = filtered.filter(provider =>
        provider.interests?.includes(selectedInterest)
      );
    }

    setFilteredProviders(filtered);
  }, [searchTerm, selectedInterest, providers]);

  const handleConnect = async (provider) => {
    // Navigate to profile to send friend request
    navigate(`/profile/${provider.id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get all unique interests from providers
  const allInterests = [...new Set(providers.flatMap(p => p.interests || []))];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading friends...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>Friend Finder</h1>
        <div style={styles.headerActions}>
          <button onClick={() => navigate('/wallet')} style={styles.iconButton} title="Wallet">
            <WalletIcon size={20} />
          </button>
          <button onClick={() => navigate('/chats')} style={styles.iconButton}>
            <MessageCircle size={20} />
          </button>
          <button onClick={() => navigate('/friend-requests')} style={styles.notificationButton}>
            <Bell size={20} />
            {pendingRequestsCount > 0 && (
              <span style={styles.badge}>{pendingRequestsCount}</span>
            )}
          </button>
          <button onClick={() => navigate('/edit-profile')} style={styles.iconButton}>
            <User size={20} />
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.feedContainer}>
          <h2 style={styles.feedTitle}>Discover Friends</h2>
          <p style={styles.feedSubtitle}>Connect with amazing people and start chatting!</p>

          {/* Search and Filter */}
          <div style={styles.filterSection}>
            <div style={styles.searchContainer}>
              <Search size={20} color="#718096" />
              <input
                type="text"
                placeholder="Search by name or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            {allInterests.length > 0 && (
              <div style={styles.interestFilter}>
                <Filter size={18} color="#718096" />
                <select
                  value={selectedInterest}
                  onChange={(e) => setSelectedInterest(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">All Interests</option>
                  {allInterests.map((interest) => (
                    <option key={interest} value={interest}>{interest}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {filteredProviders.length === 0 ? (
            <div style={styles.emptyState}>
              <Heart size={64} color="#cbd5e0" />
              <h3 style={styles.emptyTitle}>
                {searchTerm || selectedInterest !== 'all' 
                  ? 'No friends match your search' 
                  : 'No friends available yet'}
              </h3>
              <p style={styles.emptyText}>
                {searchTerm || selectedInterest !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Check back later to discover new friends!'}
              </p>
            </div>
          ) : (
            <div style={styles.grid}>
              {filteredProviders.map((provider) => (
                <div key={provider.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={styles.avatar}>
                      {provider.name?.charAt(0).toUpperCase() || 'F'}
                    </div>
                    <div style={styles.cardInfo}>
                      <h3 style={styles.cardName}>{provider.name}</h3>
                      <p style={styles.cardEmail}>{provider.email}</p>
                      {provider.isOnline && (
                        <span style={styles.onlineIndicator}>🟢 Online</span>
                      )}
                    </div>
                  </div>

                  {provider.bio && (
                    <p style={styles.cardBio}>{provider.bio}</p>
                  )}

                  {provider.interests && provider.interests.length > 0 && (
                    <div style={styles.cardInterests}>
                      {provider.interests.slice(0, 3).map((interest, idx) => (
                        <span key={idx} style={styles.interestTag}>{interest}</span>
                      ))}
                      {provider.interests.length > 3 && (
                        <span style={styles.interestTag}>+{provider.interests.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div style={styles.cardStats}>
                    <div style={styles.stat}>
                      <Heart size={16} color="#667eea" />
                      <span>Available</span>
                    </div>
                    <div style={styles.stat}>
                      <MessageCircle size={16} color="#667eea" />
                      <span>Chat</span>
                    </div>
                    <div style={styles.stat}>
                      <Video size={16} color="#667eea" />
                      <span>Video</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleConnect(provider)} 
                    style={styles.connectButton}
                  >
                    <UserPlus size={18} />
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f7fafc',
    display: 'flex',
    flexDirection: 'column'
  },
  loadingContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px'
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
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  notificationButton: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: '#f7fafc',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    color: '#4a5568',
    transition: 'all 0.2s'
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#f56565',
    color: 'white',
    borderRadius: '10px',
    padding: '2px 6px',
    fontSize: '11px',
    fontWeight: '700',
    minWidth: '20px',
    textAlign: 'center'
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: '#f7fafc',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    color: '#4a5568',
    transition: 'all 0.2s'
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#f7fafc',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    color: '#4a5568',
    transition: 'all 0.2s'
  },
  content: {
    flex: 1,
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  feedContainer: {
    width: '100%'
  },
  feedTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 8px 0'
  },
  feedSubtitle: {
    fontSize: '16px',
    color: '#718096',
    margin: '0 0 24px 0'
  },
  filterSection: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  searchContainer: {
    flex: 1,
    minWidth: '250px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '12px'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#1a202c'
  },
  interestFilter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '12px'
  },
  filterSelect: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a202c',
    cursor: 'pointer',
    background: 'white'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
    }
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px'
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
    flexShrink: 0
  },
  cardInfo: {
    flex: 1,
    minWidth: 0
  },
  cardName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 4px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  cardEmail: {
    fontSize: '13px',
    color: '#718096',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  onlineIndicator: {
    fontSize: '12px',
    color: '#48bb78',
    fontWeight: '600',
    marginTop: '4px',
    display: 'inline-block'
  },
  cardBio: {
    fontSize: '14px',
    color: '#4a5568',
    lineHeight: '1.5',
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  cardInterests: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '12px'
  },
  interestTag: {
    padding: '4px 10px',
    background: '#e6fffa',
    color: '#047857',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600'
  },
  cardStats: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    padding: '12px 0',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0'
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#718096',
    fontWeight: '500'
  },
  connectButton: {
    width: '100%',
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
    fontSize: '15px',
    transition: 'transform 0.2s'
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

export default Home;
