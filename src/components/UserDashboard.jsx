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
    background: '#f7fafc',
    padding: '20px'
  },
  header: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#718096',
    marginTop: '4px'
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#fed7d7',
    color: '#c53030',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },  homeButton: {
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
  },  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '24px'
  },
  statCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  statIcon: {
    fontSize: '32px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  statLabel: {
    fontSize: '14px',
    color: '#718096',
    marginTop: '4px'
  },
  section: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '20px'
  },
  filterSection: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  searchBox: {
    flex: 1,
    minWidth: '250px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px'
  },
  categorySelect: {
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '180px'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  serviceCard: {
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  serviceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '8px'
  },
  serviceTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  servicePrice: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#667eea'
  },
  serviceProvider: {
    fontSize: '13px',
    color: '#a0aec0',
    marginBottom: '12px'
  },
  serviceDescription: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '16px',
    lineHeight: '1.6'
  },
  serviceFooter: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px'
  },
  serviceMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#a0aec0',
    background: '#f7fafc',
    padding: '6px 10px',
    borderRadius: '6px'
  },
  bookButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'background 0.2s'
  },
  bookingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  bookingCard: {
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  bookingInfo: {
    flex: 1,
    minWidth: '200px'
  },
  bookingTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a202c',
    margin: '0 0 8px 0'
  },
  bookingDetail: {
    fontSize: '14px',
    color: '#718096',
    margin: '4px 0'
  },
  bookingStatus: {
    fontWeight: '600',
    color: '#667eea',
    textTransform: 'capitalize'
  },
  bookingActions: {
    display: 'flex',
    gap: '8px'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  emptyState: {
    textAlign: 'center',
    color: '#a0aec0',
    padding: '40px',
    fontSize: '14px'
  }
};

export default UserDashboard;
