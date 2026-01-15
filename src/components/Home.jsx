import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, Video, LogOut, User, Search, Filter, Bell, UserPlus, Wallet as WalletIcon, MapPin, Clock, Star } from 'lucide-react';
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
    background: '#f9fafb',
    display: 'flex',
    flexDirection: 'column'
  },
  loadingContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    background: '#f9fafb'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  header: {
    background: 'white',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid #e5e7eb'
  },
  logo: {
    fontSize: '28px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    letterSpacing: '-0.02em'
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
    width: '44px',
    height: '44px',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    color: '#374151',
    transition: 'all 0.2s ease'
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#ef4444',
    color: 'white',
    borderRadius: '10px',
    padding: '2px 6px',
    fontSize: '11px',
    fontWeight: '800',
    minWidth: '20px',
    textAlign: 'center',
    border: '2px solid white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    color: '#374151',
    transition: 'all 0.2s ease'
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    color: '#374151',
    transition: 'all 0.2s ease'
  },
  content: {
    flex: 1,
    padding: '40px 32px',
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%'
  },
  feedContainer: {
    width: '100%'
  },
  feedTitle: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#111827',
    margin: '0 0 12px 0',
    letterSpacing: '-0.02em'
  },
  feedSubtitle: {
    fontSize: '18px',
    color: '#6b7280',
    margin: '0 0 40px 0',
    fontWeight: '400'
  },
  filterSection: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
    flexWrap: 'wrap'
  },
  searchContainer: {
    flex: 1,
    minWidth: '280px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    background: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    transition: 'all 0.2s ease'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    color: '#111827',
    fontWeight: '500',
    background: 'transparent'
  },
  interestFilter: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 18px',
    background: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    transition: 'all 0.2s ease'
  },
  filterSelect: {
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827',
    cursor: 'pointer',
    background: 'transparent'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px'
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '28px',
    fontWeight: '800',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
  },
  cardInfo: {
    flex: 1,
    minWidth: 0
  },
  cardName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 6px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  cardEmail: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: '500'
  },
  onlineIndicator: {
    fontSize: '12px',
    color: '#10b981',
    fontWeight: '700',
    marginTop: '6px',
    display: 'inline-block'
  },
  cardBio: {
    fontSize: '15px',
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '16px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  cardInterests: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px'
  },
  interestTag: {
    padding: '6px 14px',
    background: '#f3f4f6',
    color: '#6366f1',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    border: '1px solid #e5e7eb'
  },
  cardStats: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    padding: '16px 0',
    borderTop: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb'
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '600'
  },
  connectButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 40px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#111827',
    margin: '20px 0 12px 0',
    letterSpacing: '-0.01em'
  },
  emptyText: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
    fontWeight: '500'
  }
};

export default Home;
