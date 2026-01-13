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
    background: '#f7fafc'
  },
  header: {
    background: 'white',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    borderBottom: '2px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: '#f7fafc',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#4a5568'
  },
  headerInfo: {
    flex: 1
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  headerSubtitle: {
    fontSize: '13px',
    color: '#718096',
    margin: '4px 0 0 0'
  },
  videoButton: {
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
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  messageWrapper: {
    display: 'flex',
    width: '100%'
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '12px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  },
  myMessage: {
    background: '#667eea',
    color: 'white',
    borderBottomRightRadius: '4px'
  },
  theirMessage: {
    background: 'white',
    color: '#1a202c',
    borderBottomLeftRadius: '4px'
  },
  messageSender: {
    fontSize: '11px',
    marginBottom: '4px',
    opacity: 0.8,
    fontWeight: '600'
  },
  messageText: {
    fontSize: '14px',
    lineHeight: '1.5',
    wordWrap: 'break-word'
  },
  messageTime: {
    fontSize: '10px',
    marginTop: '4px',
    opacity: 0.7,
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  readStatus: {
    fontSize: '10px',
    opacity: 0.8
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    maxWidth: '100px'
  },
  typingDots: {
    display: 'flex',
    gap: '4px'
  },
  typingText: {
    fontSize: '12px',
    color: '#718096',
    fontStyle: 'italic'
  },
  systemMessage: {
    padding: '8px 16px',
    background: '#e2e8f0',
    color: '#4a5568',
    borderRadius: '16px',
    fontSize: '13px',
    textAlign: 'center'
  },
  inputContainer: {
    background: 'white',
    padding: '16px 24px',
    display: 'flex',
    gap: '12px',
    borderTop: '2px solid #e2e8f0'
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '24px',
    fontSize: '14px',
    outline: 'none'
  },
  sendButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  }
};

export default Chat;
