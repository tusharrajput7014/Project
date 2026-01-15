import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, ArrowLeft, Video, Smile } from 'lucide-react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

const Chat = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Real-time messages listener
  useEffect(() => {
    const messagesRef = collection(db, 'bookings', bookingId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
      }));
      setMessages(messagesData);

      // Mark messages as read
      const unreadMessages = messagesData.filter(
        msg => msg.sender !== user.id && !msg.read
      );
      for (const msg of unreadMessages) {
        await updateDoc(doc(db, 'bookings', bookingId, 'messages', msg.id), {
          read: true
        });
      }
    });

    return unsubscribe;
  }, [bookingId, user.id]);

  // Listen to typing indicator
  useEffect(() => {
    const typingRef = doc(db, 'typing', bookingId);
    const unsubscribe = onSnapshot(typingRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setOtherUserTyping(data.userId !== user.id && data.isTyping);
      }
    });

    return unsubscribe;
  }, [bookingId, user.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, otherUserTyping]);

  const handleTyping = async (text) => {
    setNewMessage(text);

    // Update typing indicator
    const typingRef = doc(db, 'typing', bookingId);
    await setDoc(typingRef, {
      userId: user.id,
      isTyping: text.length > 0,
      timestamp: serverTimestamp()
    });

    // Clear typing after 2 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(async () => {
      await setDoc(typingRef, {
        userId: user.id,
        isTyping: false,
        timestamp: serverTimestamp()
      });
    }, 2000);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messagesRef = collection(db, 'bookings', bookingId, 'messages');
      await addDoc(messagesRef, {
        text: newMessage,
        sender: user.id,
        senderName: user.name,
        senderType: user.userType,
        timestamp: serverTimestamp(),
        type: 'text',
        read: false
      });

      setNewMessage('');
      
      // Clear typing indicator
      const typingRef = doc(db, 'typing', bookingId);
      await setDoc(typingRef, {
        userId: user.id,
        isTyping: false,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const startVideoCall = () => {
    navigate(`/video/${bookingId}`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={20} />
        </button>
        <div style={styles.headerInfo}>
          <h2 style={styles.headerTitle}>Chat</h2>
          <p style={styles.headerSubtitle}>Booking ID: {bookingId}</p>
        </div>
        <button onClick={startVideoCall} style={styles.videoButton}>
          <Video size={20} />
          Video Call
        </button>
      </div>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.messageWrapper,
              justifyContent: message.sender === user.id ? 'flex-end' : 'flex-start'
            }}
          >
            {message.sender === 'system' ? (
              <div style={styles.systemMessage}>
                {message.text}
              </div>
            ) : (
              <div
                style={{
                  ...styles.messageBubble,
                  ...(message.sender === user.id
                    ? styles.myMessage
                    : styles.theirMessage)
                }}
              >
                <div style={styles.messageSender}>
                  {message.senderName} ({message.senderType})
                </div>
                <div style={styles.messageText}>{message.text}</div>
                <div style={styles.messageTime}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                  {message.sender === user.id && (
                    <span style={styles.readStatus}>
                      {message.read ? ' ✓✓' : ' ✓'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {otherUserTyping && (
          <div style={styles.typingIndicator}>
            <div style={styles.typingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span style={styles.typingText}>typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} style={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button type="submit" style={styles.sendButton}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#000000'
  },
  header: {
    background: '#0a0a0a',
    padding: '20px 32px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    borderBottom: '1px solid #222222',
    boxShadow: '0 1px 3px rgba(255, 255, 255, 0.05)'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    background: '#111111',
    border: '1px solid #333333',
    borderRadius: '10px',
    cursor: 'pointer',
    color: '#ffffff',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  headerInfo: {
    flex: 1
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.01em'
  },
  headerSubtitle: {
    fontSize: '13px',
    color: '#999999',
    margin: '6px 0 0 0',
    fontWeight: '500'
  },
  videoButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'white',
    color: '#000000',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.25)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  messageWrapper: {
    display: 'flex',
    width: '100%'
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '14px 18px',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.05)'
  },
  myMessage: {
    background: 'white',
    color: '#000000',
    borderBottomRightRadius: '6px'
  },
  theirMessage: {
    background: '#0a0a0a',
    color: '#ffffff',
    borderBottomLeftRadius: '6px',
    border: '1px solid #222222'
  },
  messageSender: {
    fontSize: '11px',
    marginBottom: '6px',
    opacity: 0.85',
    fontWeight: '700'
  },
  messageText: {
    fontSize: '15px',
    lineHeight: '1.6',
    wordWrap: 'break-word'
  },
  messageTime: {
    fontSize: '10px',
    marginTop: '6px',
    opacity: 0.75,
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  readStatus: {
    fontSize: '10px',
    opacity: 0.85
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    maxWidth: '120px'
  },
  typingDots: {
    display: 'flex',
    gap: '4px'
  },
  typingText: {
    fontSize: '12px',
    color: '#64748b',
    fontStyle: 'italic',
    fontWeight: '500'
  },
  systemMessage: {
    padding: '10px 20px',
    background: '#111111',
    color: '#999999',
    borderRadius: '20px',
    fontSize: '13px',
    textAlign: 'center',
    fontWeight: '500',
    border: '1px solid #222222'
  },
  inputContainer: {
    background: '#0a0a0a',
    padding: '20px 32px',
    display: 'flex',
    gap: '16px',
    borderTop: '1px solid #222222'
  },
  input: {
    flex: 1,
    padding: '14px 20px',
    border: '2px solid #333333',
    borderRadius: '24px',
    fontSize: '15px',
    outline: 'none',
    color: '#ffffff',
    fontWeight: '500',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: '#111111'
  },
  sendButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '52px',
    height: '52px',
    background: 'white',
    color: '#000000',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.25)'
  }
};

export default Chat;
