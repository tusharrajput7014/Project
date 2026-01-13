import { useNavigate } from 'react-router-dom';
import { Users, Heart, Video, MessageCircle, Sparkles, Globe } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleFindFriend = () => {
    navigate('/login?type=user');
  };

  const handleBecomeFriend = () => {
    navigate('/login?type=friend');
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.logoContainer}>
            <Heart size={48} style={{ color: '#667eea' }} />
          </div>
          <h1 style={styles.heroTitle}>
            Find Your Perfect Friend
          </h1>
          <p style={styles.heroSubtitle}>
            Connect with amazing people through chat and video calls. 
            Whether you're looking for friendship or want to be someone's friend, we've got you covered.
          </p>
          
          <div style={styles.ctaButtons}>
            <button 
              onClick={handleFindFriend}
              style={styles.primaryButton}
            >
              <Users size={20} />
              Looking for a Friend
            </button>
            <button 
              onClick={handleBecomeFriend}
              style={styles.secondaryButton}
            >
              <Sparkles size={20} />
              Register as a Friend
            </button>
          </div>
        </div>

        <div style={styles.heroImage}>
          <div style={styles.floatingCard1}>
            <MessageCircle size={32} style={{ color: '#667eea' }} />
            <p style={styles.cardText}>Instant Chat</p>
          </div>
          <div style={styles.floatingCard2}>
            <Video size={32} style={{ color: '#f56565' }} />
            <p style={styles.cardText}>Video Calls</p>
          </div>
          <div style={styles.floatingCard3}>
            <Globe size={32} style={{ color: '#48bb78' }} />
            <p style={styles.cardText}>Global Connect</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Choose Us?</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>💬</div>
            <h3 style={styles.featureTitle}>Real-time Chat</h3>
            <p style={styles.featureDescription}>
              Connect instantly with friends through our seamless chat interface
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📹</div>
            <h3 style={styles.featureTitle}>Video Calls</h3>
            <p style={styles.featureDescription}>
              Face-to-face conversations with crystal clear video quality
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔒</div>
            <h3 style={styles.featureTitle}>Safe & Secure</h3>
            <p style={styles.featureDescription}>
              Your privacy and security are our top priorities
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🌟</div>
            <h3 style={styles.featureTitle}>Easy to Use</h3>
            <p style={styles.featureDescription}>
              Simple, intuitive interface that anyone can use
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.stepsContainer}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <h3 style={styles.stepTitle}>Choose Your Role</h3>
            <p style={styles.stepDescription}>
              Looking for a friend or want to be one? Pick your preference
            </p>
          </div>

          <div style={styles.stepArrow}>→</div>

          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <h3 style={styles.stepTitle}>Create Account</h3>
            <p style={styles.stepDescription}>
              Sign up quickly with just your email and password
            </p>
          </div>

          <div style={styles.stepArrow}>→</div>

          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <h3 style={styles.stepTitle}>Start Connecting</h3>
            <p style={styles.stepDescription}>
              Chat and video call with friends from around the world
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Make New Friends?</h2>
        <p style={styles.ctaText}>Join thousands of people connecting every day</p>
        <div style={styles.ctaButtons}>
          <button 
            onClick={handleFindFriend}
            style={styles.primaryButton}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2026 Friend Finder. Connect, Chat, Grow.
        </p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f7fafc'
  },
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    position: 'relative',
    overflow: 'hidden'
  },
  heroContent: {
    maxWidth: '600px',
    textAlign: 'center',
    zIndex: 2
  },
  logoContainer: {
    marginBottom: '20px'
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '20px',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '40px',
    lineHeight: '1.6'
  },
  ctaButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 32px',
    background: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 32px',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '2px solid white',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.2s, background 0.2s'
  },
  heroImage: {
    position: 'absolute',
    right: '10%',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  floatingCard1: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    animation: 'float 3s ease-in-out infinite',
    animationDelay: '0s'
  },
  floatingCard2: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    animation: 'float 3s ease-in-out infinite',
    animationDelay: '1s',
    marginLeft: '40px'
  },
  floatingCard3: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    animation: 'float 3s ease-in-out infinite',
    animationDelay: '2s'
  },
  cardText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
    margin: 0
  },
  features: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '700',
    textAlign: 'center',
    color: '#1a202c',
    marginBottom: '48px'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px'
  },
  featureCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '12px'
  },
  featureDescription: {
    fontSize: '14px',
    color: '#718096',
    lineHeight: '1.6'
  },
  howItWorks: {
    padding: '80px 20px',
    background: 'white',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0'
  },
  stepsContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    flexWrap: 'wrap'
  },
  step: {
    flex: '1',
    minWidth: '200px',
    textAlign: 'center'
  },
  stepNumber: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px'
  },
  stepTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '8px'
  },
  stepDescription: {
    fontSize: '14px',
    color: '#718096',
    lineHeight: '1.5'
  },
  stepArrow: {
    fontSize: '32px',
    color: '#cbd5e0',
    fontWeight: '700'
  },
  ctaSection: {
    padding: '80px 20px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '16px'
  },
  ctaText: {
    fontSize: '18px',
    marginBottom: '32px',
    opacity: 0.9
  },
  footer: {
    padding: '24px',
    textAlign: 'center',
    background: '#1a202c'
  },
  footerText: {
    color: '#a0aec0',
    fontSize: '14px',
    margin: 0
  }
};

export default LandingPage;
