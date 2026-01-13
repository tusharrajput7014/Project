import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_YOUR_STRIPE_KEY');

const PaymentForm = ({ service, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { createBooking } = useServices();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate payment processing
    // In production, you would create a PaymentIntent on your backend
    setTimeout(() => {
      // Create booking after successful payment
      const booking = createBooking({
        serviceId: service.id,
        serviceTitle: service.title,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        providerId: service.providerId,
        providerName: service.providerName,
        providerEmail: service.providerEmail,
        price: service.price,
        duration: service.duration,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'card'
      });

      setLoading(false);
      onSuccess(booking);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.cardElementContainer}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1a202c',
                '::placeholder': {
                  color: '#a0aec0',
                },
              },
            },
          }}
        />
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          ...styles.submitButton,
          ...(loading ? styles.submitButtonDisabled : {})
        }}
      >
        {loading ? 'Processing...' : `Pay $${service.price}`}
      </button>

      <div style={styles.secureInfo}>
        <Lock size={14} />
        <span>Secure payment powered by Stripe</span>
      </div>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service;
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [booking, setBooking] = useState(null);

  if (!service) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h2>No service selected</h2>
          <button onClick={() => navigate('/user/dashboard')} style={styles.button}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handlePaymentSuccess = (newBooking) => {
    setBooking(newBooking);
    setPaymentComplete(true);
  };

  if (paymentComplete) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✓</div>
          <h1 style={styles.successTitle}>Payment Successful!</h1>
          <p style={styles.successText}>
            Your booking has been confirmed. You can now chat with the provider.
          </p>
          
          <div style={styles.bookingDetails}>
            <h3 style={styles.detailsTitle}>Booking Details</h3>
            <div style={styles.detailRow}>
              <span>Service:</span>
              <span>{service.title}</span>
            </div>
            <div style={styles.detailRow}>
              <span>Provider:</span>
              <span>{service.providerName}</span>
            </div>
            <div style={styles.detailRow}>
              <span>Duration:</span>
              <span>{service.duration} minutes</span>
            </div>
            <div style={styles.detailRow}>
              <span>Amount Paid:</span>
              <span style={styles.amountPaid}>${service.price}</span>
            </div>
          </div>

          <div style={styles.successActions}>
            <button
              onClick={() => navigate(`/chat/${booking.id}`)}
              style={styles.primaryButton}
            >
              Start Chat
            </button>
            <button
              onClick={() => navigate('/user/dashboard')}
              style={styles.secondaryButton}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={20} />
          Back
        </button>

        <div style={styles.header}>
          <CreditCard size={32} style={{ color: '#667eea' }} />
          <h1 style={styles.title}>Complete Payment</h1>
        </div>

        {/* Service Summary */}
        <div style={styles.serviceCard}>
          <h3 style={styles.serviceTitle}>{service.title}</h3>
          <p style={styles.serviceProvider}>by {service.providerName}</p>
          <p style={styles.serviceDescription}>{service.description}</p>
          
          <div style={styles.serviceMeta}>
            <span>⏱️ {service.duration} minutes</span>
            <span>📂 {service.category}</span>
          </div>

          <div style={styles.priceSection}>
            <span style={styles.priceLabel}>Total Amount</span>
            <span style={styles.priceValue}>${service.price}</span>
          </div>
        </div>

        {/* Payment Form */}
        <div style={styles.paymentSection}>
          <h2 style={styles.sectionTitle}>Payment Information</h2>
          <Elements stripe={stripePromise}>
            <PaymentForm service={service} onSuccess={handlePaymentSuccess} />
          </Elements>
        </div>

        {/* Demo Notice */}
        <div style={styles.demoNotice}>
          <p style={styles.demoText}>
            💡 <strong>Demo Mode:</strong> This is a demonstration. In production, integrate with 
            your Stripe account using real API keys and create payment intents on your backend.
          </p>
          <p style={styles.demoText}>
            Use test card: 4242 4242 4242 4242, any future date, any CVC
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#f7fafc',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '24px'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  serviceCard: {
    background: '#f7fafc',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px'
  },
  serviceTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 8px 0'
  },
  serviceProvider: {
    fontSize: '14px',
    color: '#a0aec0',
    margin: '0 0 16px 0'
  },
  serviceDescription: {
    fontSize: '14px',
    color: '#718096',
    lineHeight: '1.6',
    marginBottom: '16px'
  },
  serviceMeta: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    fontSize: '13px',
    color: '#a0aec0'
  },
  priceSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '2px solid #e2e8f0'
  },
  priceLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#4a5568'
  },
  priceValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#667eea'
  },
  paymentSection: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '16px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  cardElementContainer: {
    padding: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white'
  },
  submitButton: {
    padding: '16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  secureInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#718096'
  },
  error: {
    padding: '12px',
    background: '#fed7d7',
    color: '#c53030',
    borderRadius: '8px',
    fontSize: '14px'
  },
  demoNotice: {
    background: '#fef5e7',
    border: '2px solid #f39c12',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '24px'
  },
  demoText: {
    fontSize: '13px',
    color: '#7d6608',
    margin: '4px 0',
    lineHeight: '1.5'
  },
  successCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '48px 32px',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center'
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#48bb78',
    color: 'white',
    fontSize: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px'
  },
  successTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 12px 0'
  },
  successText: {
    fontSize: '16px',
    color: '#718096',
    marginBottom: '32px',
    lineHeight: '1.6'
  },
  bookingDetails: {
    background: '#f7fafc',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
    textAlign: 'left'
  },
  detailsTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '16px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
    color: '#4a5568'
  },
  amountPaid: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#667eea'
  },
  successActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  primaryButton: {
    padding: '14px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  secondaryButton: {
    padding: '14px',
    background: '#f7fafc',
    color: '#4a5568',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  errorCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '48px',
    textAlign: 'center'
  },
  button: {
    marginTop: '20px',
    padding: '12px 24px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600'
  }
};

export default Payment;
