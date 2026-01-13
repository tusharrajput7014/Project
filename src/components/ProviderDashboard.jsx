import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { 
  Plus, 
  DollarSign, 
  Video, 
  MessageSquare, 
  LogOut, 
  Edit, 
  Trash2,
  Calendar
} from 'lucide-react';

const ProviderDashboard = () => {
  const { user, logout } = useAuth();
  const { addService, getServicesByProvider, getBookingsByProvider } = useServices();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const navigate = useNavigate();

  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    category: 'consultation'
  });

  useEffect(() => {
    if (user) {
      setServices(getServicesByProvider(user.id));
      setBookings(getBookingsByProvider(user.id));
    }
  }, [user]);

  const handleAddService = (e) => {
    e.preventDefault();
    const service = addService({
      ...newService,
      providerId: user.id,
      providerName: user.name,
      providerEmail: user.email
    });
    setServices([...services, service]);
    setNewService({
      title: '',
      description: '',
      price: '',
      duration: '',
      category: 'consultation'
    });
    setShowAddService(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
          <h1 style={styles.headerTitle}>Provider Dashboard</h1>
          <p style={styles.headerSubtitle}>Welcome back, {user?.name}</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <LogOut size={18} />
          Logout
        </button>
      </header>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💼</div>
          <div>
            <p style={styles.statValue}>{services.length}</p>
            <p style={styles.statLabel}>Active Services</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📅</div>
          <div>
            <p style={styles.statValue}>{bookings.length}</p>
            <p style={styles.statLabel}>Total Bookings</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div>
            <p style={styles.statValue}>
              ${bookings.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0).toFixed(2)}
            </p>
            <p style={styles.statLabel}>Total Earnings</p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>My Services</h2>
          <button
            onClick={() => setShowAddService(!showAddService)}
            style={styles.addButton}
          >
            <Plus size={20} />
            Add Service
          </button>
        </div>

        {showAddService && (
          <form onSubmit={handleAddService} style={styles.form}>
            <div style={styles.formGrid}>
              <input
                type="text"
                placeholder="Service Title"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                required
                style={styles.input}
              />
              <select
                value={newService.category}
                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                style={styles.input}
              >
                <option value="consultation">Consultation</option>
                <option value="coaching">Coaching</option>
                <option value="therapy">Therapy</option>
                <option value="tutoring">Tutoring</option>
                <option value="other">Other</option>
              </select>
              <input
                type="number"
                placeholder="Price ($)"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                required
                style={styles.input}
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            <textarea
              placeholder="Service Description"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              required
              style={{ ...styles.input, minHeight: '100px' }}
            />
            <div style={styles.formActions}>
              <button type="submit" style={styles.submitButton}>
                Create Service
              </button>
              <button
                type="button"
                onClick={() => setShowAddService(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={styles.servicesGrid}>
          {services.map((service) => (
            <div key={service.id} style={styles.serviceCard}>
              <div style={styles.serviceHeader}>
                <h3 style={styles.serviceTitle}>{service.title}</h3>
                <span style={styles.servicePrice}>${service.price}</span>
              </div>
              <p style={styles.serviceDescription}>{service.description}</p>
              <div style={styles.serviceFooter}>
                <span style={styles.serviceMeta}>
                  ⏱️ {service.duration} min
                </span>
                <span style={styles.serviceMeta}>
                  📂 {service.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Bookings</h2>
        <div style={styles.bookingsList}>
          {bookings.length === 0 ? (
            <p style={styles.emptyState}>No bookings yet</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} style={styles.bookingCard}>
                <div style={styles.bookingInfo}>
                  <h4 style={styles.bookingTitle}>{booking.serviceTitle}</h4>
                  <p style={styles.bookingDetail}>User: {booking.userName}</p>
                  <p style={styles.bookingDetail}>
                    Status: <span style={styles.bookingStatus}>{booking.status}</span>
                  </p>
                </div>
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
                    Video
                  </button>
                </div>
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
  },
  statsGrid: {
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
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  addButton: {
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
  form: {
    background: '#f7fafc',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '12px'
  },
  input: {
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px'
  },
  submitButton: {
    padding: '12px 24px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  cancelButton: {
    padding: '12px 24px',
    background: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px'
  },
  serviceCard: {
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px'
  },
  serviceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px'
  },
  serviceTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  servicePrice: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#667eea'
  },
  serviceDescription: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '12px',
    lineHeight: '1.5'
  },
  serviceFooter: {
    display: 'flex',
    gap: '12px'
  },
  serviceMeta: {
    fontSize: '12px',
    color: '#a0aec0',
    background: '#f7fafc',
    padding: '4px 8px',
    borderRadius: '4px'
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
    color: '#667eea'
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

export default ProviderDashboard;
