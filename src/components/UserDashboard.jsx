import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { 
  Search, 
  LogOut, 
  Calendar, 
  MessageSquare, 
  Video,
  CreditCard,
  Clock,
  Star,
  Home
} from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { services, bookings, getBookingsByUser } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredServices, setFilteredServices] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setMyBookings(getBookingsByUser(user.id));
    }
  }, [user, bookings]);

  useEffect(() => {
    let filtered = services;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const bookService = (service) => {
    navigate('/payment', { state: { service } });
  };

  const startChat = (bookingId) => {
    navigate(`/chat/${bookingId}`);
  };

  const startVideoCall = (bookingId) => {
    navigate(`/video/${bookingId}`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>User Dashboard</h1>
          <p style={styles.headerSubtitle}>Welcome back, {user?.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/chats')} style={styles.homeButton}>
            <MessageSquare size={18} />
            Messages
          </button>
          <button onClick={() => navigate('/home')} style={styles.homeButton}>
            <Home size={18} />
            Home Feed
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📅</div>
          <div>
            <p style={styles.statValue}>{myBookings.length}</p>
            <p style={styles.statLabel}>My Bookings</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div>
            <p style={styles.statValue}>
              {myBookings.filter(b => b.status === 'completed').length}
            </p>
            <p style={styles.statLabel}>Completed</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div>
            <p style={styles.statValue}>
              ${myBookings.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0).toFixed(2)}
            </p>
            <p style={styles.statLabel}>Total Spent</p>
          </div>
        </div>
      </div>

      {/* My Bookings */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>My Bookings</h2>
        <div style={styles.bookingsList}>
          {myBookings.length === 0 ? (
            <p style={styles.emptyState}>No bookings yet. Browse services below!</p>
          ) : (
            myBookings.map((booking) => (
              <div key={booking.id} style={styles.bookingCard}>
                <div style={styles.bookingInfo}>
                  <h4 style={styles.bookingTitle}>{booking.serviceTitle}</h4>
                  <p style={styles.bookingDetail}>Provider: {booking.providerName}</p>
                  <p style={styles.bookingDetail}>
                    Status: <span style={styles.bookingStatus}>{booking.status}</span>
                  </p>
                  <p style={styles.bookingDetail}>Price: ${booking.price}</p>
                </div>
                {booking.status === 'confirmed' && (
                  <div style={styles.bookingActions}>
                    <button
                      onClick={() => startChat(booking.id)}
                      style={styles.actionButton}
                    >
                      <MessageSquare size={18} />
                      Chat
                    </button>
                    <button
                      onClick={() => startVideoCall(booking.id)}
                      style={styles.actionButton}
                    >
                      <Video size={18} />
                      Video Call
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Browse Services */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Browse Services</h2>
        
        {/* Search and Filter */}
        <div style={styles.filterSection}>
          <div style={styles.searchBox}>
            <Search size={20} style={{ color: '#a0aec0' }} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.categorySelect}
          >
            <option value="all">All Categories</option>
            <option value="consultation">Consultation</option>
            <option value="coaching">Coaching</option>
            <option value="therapy">Therapy</option>
            <option value="tutoring">Tutoring</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Services Grid */}
        <div style={styles.servicesGrid}>
          {filteredServices.length === 0 ? (
            <p style={styles.emptyState}>No services found</p>
          ) : (
            filteredServices.map((service) => (
              <div key={service.id} style={styles.serviceCard}>
                <div style={styles.serviceHeader}>
                  <h3 style={styles.serviceTitle}>{service.title}</h3>
                  <span style={styles.servicePrice}>${service.price}</span>
                </div>
                <p style={styles.serviceProvider}>
                  by {service.providerName}
                </p>
                <p style={styles.serviceDescription}>{service.description}</p>
                <div style={styles.serviceFooter}>
                  <span style={styles.serviceMeta}>
                    <Clock size={14} />
                    {service.duration} min
                  </span>
                  <span style={styles.serviceMeta}>
                    📂 {service.category}
                  </span>
                </div>
                <button
                  onClick={() => bookService(service)}
                  style={styles.bookButton}
                >
                  <CreditCard size={18} />
                  Book Now
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#000000',
    padding: '24px'
  },
  header: {
    background: '#0a0a0a',
    borderRadius: '16px',
    padding: '28px 32px',
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(255, 255, 255, 0.05)',
    border: '1px solid #222222'
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.02em'
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#999999',
    marginTop: '6px'
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },  homeButton: {
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
  },  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
    marginBottom: '28px'
  },
  statCard: {
    background: '#0a0a0a',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 1px 3px rgba(255, 255, 255, 0.05)',
    border: '1px solid #222222',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  statIcon: {
    fontSize: '36px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  statLabel: {
    fontSize: '14px',
    color: '#999999',
    marginTop: '6px',
    fontWeight: '500'
  },
  section: {
    background: '#0a0a0a',
    borderRadius: '16px',
    padding: '28px 32px',
    marginBottom: '28px',
    boxShadow: '0 1px 3px rgba(255, 255, 255, 0.05)',
    border: '1px solid #222222'
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '24px',
    letterSpacing: '-0.01em'
  },
  filterSection: {
    display: 'flex',
    gap: '16px',
    marginBottom: '28px',
    flexWrap: 'wrap'
  },
  searchBox: {
    flex: 1,
    minWidth: '280px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    border: '2px solid #333333',
    borderRadius: '12px',
    background: '#111111',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    color: '#ffffff',
    background: 'transparent'
  },
  categorySelect: {
    padding: '14px 18px',
    border: '2px solid #333333',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '200px',
    fontWeight: '500',
    color: '#ffffff',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: '#111111'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
  },
  serviceCard: {
    border: '2px solid #333333',
    borderRadius: '16px',
    padding: '24px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    background: '#0a0a0a'
  },
  serviceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px'
  },
  serviceTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  servicePrice: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#ffffff'
  },
  serviceProvider: {
    fontSize: '13px',
    color: '#666666',
    marginBottom: '16px',
    fontWeight: '500'
  },
  serviceDescription: {
    fontSize: '15px',
    color: '#999999',
    marginBottom: '20px',
    lineHeight: '1.7'
  },
  serviceFooter: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px'
  },
  serviceMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#999999',
    background: '#111111',
    padding: '8px 12px',
    borderRadius: '8px',
    fontWeight: '500'
  },
  bookButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px',
    background: 'white',
    color: '#000000',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '15px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.25)'
  },
  bookingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  bookingCard: {
    border: '2px solid #333333',
    borderRadius: '12px',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    background: '#0a0a0a',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  bookingInfo: {
    flex: 1,
    minWidth: '220px'
  },
  bookingTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 10px 0'
  },
  bookingDetail: {
    fontSize: '14px',
    color: '#999999',
    margin: '6px 0',
    fontWeight: '500'
  },
  bookingStatus: {
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'capitalize'
  },
  bookingActions: {
    display: 'flex',
    gap: '10px'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'white',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '700',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.25)'
  },
  emptyState: {
    textAlign: 'center',
    color: '#666666',
    padding: '60px',
    fontSize: '15px',
    fontWeight: '500'
  }
};

export default UserDashboard;
