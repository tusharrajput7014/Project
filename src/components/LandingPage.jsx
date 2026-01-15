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
            <Heart size={48} style={{ color: 'white' }} />
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
    background: '#000000'
  },
  hero: {
    background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)',
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
    marginBottom: '24px'
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '24px',
    lineHeight: '1.1',
    letterSpacing: '-0.02em'
  },
  heroSubtitle: {
    fontSize: '20px',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: '48px',
    lineHeight: '1.7',
    fontWeight: '400'
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
    gap: '10px',
    padding: '16px 32px',
    background: 'white',
    color: '#000000',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 10px 25px rgba(255, 255, 255, 0.15)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 32px',
    background: 'transparent',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
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
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
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
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
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
    color: '#000000',
    margin: 0
  },
  features: {
    padding: '100px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sectionTitle: {
    fontSize: '42px',
    fontWeight: '800',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: '16px',
    letterSpacing: '-0.02em'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
    marginTop: '64px'
  },
  featureCard: {
    background: '#0a0a0a',
    padding: '40px 32px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #222222'
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '20px'
  },
  featureTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '12px'
  },
  featureDescription: {
    fontSize: '15px',
    color: '#a0a0a0',
    lineHeight: '1.7'
  },
  howItWorks: {
    padding: '100px 20px',
    background: '#0a0a0a',
    borderTop: '1px solid #222222',
    borderBottom: '1px solid #222222'
  },
  stepsContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '32px',
    flexWrap: 'wrap',
    marginTop: '64px'
  },
  step: {
    flex: '1',
    minWidth: '220px',
    textAlign: 'center'
  },
  stepNumber: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'white',
    color: '#000000',
    fontSize: '28px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 8px 20px rgba(255, 255, 255, 0.25)'
  },
  stepTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '12px'
  },
  stepDescription: {
    fontSize: '15px',
    color: '#a0a0a0',
    lineHeight: '1.6'
  },
  stepArrow: {
    fontSize: '32px',
    color: '#444444',
    fontWeight: '700'
  },
  ctaSection: {
    padding: '100px 20px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #1a1a1a 100%)',
    color: 'white',
    borderTop: '1px solid #222222'
  },
  ctaTitle: {
    fontSize: '42px',
    fontWeight: '800',
    marginBottom: '20px',
    letterSpacing: '-0.02em'
  },
  ctaText: {
    fontSize: '20px',
    marginBottom: '40px',
    opacity: 0.95,
    fontWeight: '400'
  },
  footer: {
    padding: '32px',
    textAlign: 'center',
    background: '#000000',
    borderTop: '1px solid #222222'
  },
  footerText: {
    color: '#666666',
    fontSize: '14px',
    margin: 0
  }
};

export default LandingPage;
