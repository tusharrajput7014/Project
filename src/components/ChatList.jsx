import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ArrowLeft, MessageCircle, Search } from 'lucide-react';

const ChatList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChats();
  }, [user.id]);

  const fetchChats = async () => {
    try {
      // Get all bookings/connections for this user
      const bookingsRef = collection(db, 'bookings');
      const q = user.userType === 'provider'
        ? query(bookingsRef, where('providerId', '==', user.id))
        : query(bookingsRef, where('userId', '==', user.id));

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const bookings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch last message for each booking
        const chatsWithMessages = await Promise.all(
          bookings.map(async (booking) => {
            const messagesRef = collection(db, 'bookings', booking.id, 'messages');
            const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
            const messagesSnapshot = await getDocs(messagesQuery);
            
            const lastMessage = messagesSnapshot.docs[0]?.data();
            const unreadQuery = query(
              collection(db, 'bookings', booking.id, 'messages'),
              where('sender', '!=', user.id),
              where('read', '==', false)
            );
            const unreadSnapshot = await getDocs(unreadQuery);

            return {
              ...booking,
              lastMessage,
              unreadCount: unreadSnapshot.docs.length
            };
          })
        );

        // Sort by last message timestamp
        chatsWithMessages.sort((a, b) => {
          const aTime = a.lastMessage?.timestamp?.toDate() || a.createdAt?.toDate() || 0;
          const bTime = b.lastMessage?.timestamp?.toDate() || b.createdAt?.toDate() || 0;
          return bTime - aTime;
        });

        setChats(chatsWithMessages);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  };

  const getContactName = (chat) => {
    return user.userType === 'provider' ? chat.userName : chat.providerName;
  };

  const filteredChats = searchTerm
    ? chats.filter(chat => 
        getContactName(chat)?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : chats;

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
        <h2 style={styles.headerTitle}>Messages</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <Search size={20} color="#718096" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Chat List */}
      <div style={styles.chatsList}>
        {filteredChats.length === 0 ? (
          <div style={styles.emptyState}>
            <MessageCircle size={64} color="#cbd5e0" />
            <h3 style={styles.emptyTitle}>No conversations yet</h3>
            <p style={styles.emptyText}>
              {searchTerm 
                ? 'No chats match your search'
                : 'Start chatting with friends from the home feed!'}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              style={styles.chatCard}
            >
              <div style={styles.chatAvatar}>
                {getContactName(chat)?.charAt(0).toUpperCase()}
              </div>
              <div style={styles.chatInfo}>
                <div style={styles.chatHeader}>
                  <h3 style={styles.chatName}>{getContactName(chat)}</h3>
                  {chat.lastMessage && (
                    <span style={styles.chatTime}>
                      {new Date(chat.lastMessage.timestamp?.toDate()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
                <div style={styles.chatPreviewRow}>
                  <p style={styles.chatPreview}>
                    {chat.lastMessage?.text || 'No messages yet'}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span style={styles.unreadBadge}>{chat.unreadCount}</span>
                  )}
                </div>
              </div>
            </div>
          ))
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
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 24px',
    background: 'white',
    borderBottom: '1px solid #e2e8f0'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#1a202c'
  },
  chatsList: {
    background: 'white'
  },
  chatCard: {
    display: 'flex',
    gap: '12px',
    padding: '16px 24px',
    cursor: 'pointer',
    borderBottom: '1px solid #e2e8f0',
    transition: 'background 0.2s'
  },
  chatAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px',
    fontWeight: '700',
    flexShrink: 0
  },
  chatInfo: {
    flex: 1,
    minWidth: 0
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
  },
  chatName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a202c',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  chatTime: {
    fontSize: '12px',
    color: '#a0aec0',
    flexShrink: 0
  },
  chatPreviewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px'
  },
  chatPreview: {
    fontSize: '14px',
    color: '#718096',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1
  },
  unreadBadge: {
    background: '#667eea',
    color: 'white',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: '700',
    flexShrink: 0
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 32px'
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

export default ChatList;
