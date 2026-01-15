import { useNavigate } from 'react-router-dom';
import { Users, Heart, Video, MessageCircle, Sparkles, Globe, Star, Shield, Zap, CheckCircle, Clock, Award } from 'lucide-react';

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
      {/* Navigation */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.logo}>
            <Heart size={28} style={{ color: '#6366f1' }} />
            <span style={styles.logoText}>Friend Finder</span>
          </div>
          <div style={styles.navButtons}>
            <button onClick={() => navigate('/login')} style={styles.navLoginBtn}>
              Sign In
            </button>
            <button onClick={handleFindFriend} style={styles.navSignupBtn}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>
            <Sparkles size={14} style={{ color: '#6366f1' }} />
            <span>Join 10,000+ users worldwide</span>
          </div>
          <h1 style={styles.heroTitle}>
            Connect With Friends
            <br />
            <span style={styles.gradient}>Anytime, Anywhere</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Book 1-on-1 video calls and chat sessions with amazing people. 
            Share experiences, get advice, or simply have a meaningful conversation.
          </p>
          
          <div style={styles.ctaButtons}>
            <button 
              onClick={handleFindFriend}
              style={styles.primaryButton}
            >
              <Users size={20} />
              Find a Friend
            </button>
            <button 
              onClick={handleBecomeFriend}
              style={styles.secondaryButton}
            >
              <Sparkles size={20} />
              Become a Friend
            </button>
          </div>

          <div style={styles.socialProof}>
            <div style={styles.proofItem}>
              <Star size={16} fill="#fbbf24" style={{ color: '#fbbf24' }} />
              <span>4.9/5 rating</span>
            </div>
            <div style={styles.proofDivider}>•</div>
            <div style={styles.proofItem}>
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              <span>5000+ sessions</span>
            </div>
            <div style={styles.proofDivider}>•</div>
            <div style={styles.proofItem}>
              <Clock size={16} style={{ color: '#6366f1' }} />
              <span>Available 24/7</span>
            </div>
          </div>
        </div>

        <div style={styles.heroImageContainer}>
          <div style={styles.heroImageGrid}>
            <div style={styles.floatingCard1}>
              <MessageCircle size={28} style={{ color: '#6366f1' }} />
              <p style={styles.cardTitle}>Instant Chat</p>
              <p style={styles.cardSubtitle}>Real-time messaging</p>
            </div>
            <div style={styles.floatingCard2}>
              <Video size={28} style={{ color: '#8b5cf6' }} />
              <p style={styles.cardTitle}>HD Video</p>
              <p style={styles.cardSubtitle}>Crystal clear calls</p>
            </div>
            <div style={styles.floatingCard3}>
              <Shield size={28} style={{ color: '#10b981' }} />
              <p style={styles.cardTitle}>Secure</p>
              <p style={styles.cardSubtitle}>End-to-end encrypted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.stats}>
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>10K+</div>
            <div style={styles.statLabel}>Active Users</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>5K+</div>
            <div style={styles.statLabel}>Sessions Booked</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>4.9</div>
            <div style={styles.statLabel}>Average Rating</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>Availability</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.featuresHeader}>
          <h2 style={styles.sectionTitle}>Everything You Need</h2>
          <p style={styles.sectionSubtitle}>
            Powerful features to help you connect and grow
          </p>
        </div>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <MessageCircle size={24} style={{ color: '#6366f1' }} />
            </div>
            <h3 style={styles.featureTitle}>Real-time Chat</h3>
            <p style={styles.featureDescription}>
              Connect instantly with typing indicators, read receipts, and seamless messaging
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <Video size={24} style={{ color: '#8b5cf6' }} />
            </div>
            <h3 style={styles.featureTitle}>HD Video Calls</h3>
            <p style={styles.featureDescription}>
              Face-to-face conversations with crystal clear quality and low latency
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <Shield size={24} style={{ color: '#10b981' }} />
            </div>
            <h3 style={styles.featureTitle}>Safe & Secure</h3>
            <p style={styles.featureDescription}>
              End-to-end encryption and verified profiles ensure your safety
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <Zap size={24} style={{ color: '#f59e0b' }} />
            </div>
            <h3 style={styles.featureTitle}>Instant Booking</h3>
            <p style={styles.featureDescription}>
              Book sessions in seconds with integrated payments and scheduling
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <Award size={24} style={{ color: '#ec4899' }} />
            </div>
            <h3 style={styles.featureTitle}>Verified Experts</h3>
            <p style={styles.featureDescription}>
              Connect with verified friends who are passionate about helping others
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <Globe size={24} style={{ color: '#14b8a6' }} />
            </div>
            <h3 style={styles.featureTitle}>Global Community</h3>
            <p style={styles.featureDescription}>
              Connect with people from around the world in any timezone
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.howItWorks}>
        <div style={styles.featuresHeader}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>
            Get started in three simple steps
          </p>
        </div>
        <div style={styles.stepsContainer}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepIcon}>
              <Users size={32} style={{ color: '#6366f1' }} />
            </div>
            <h3 style={styles.stepTitle}>Choose Your Role</h3>
            <p style={styles.stepDescription}>
              Looking for a friend or want to offer your time? Select what works for you
            </p>
          </div>

          <div style={styles.stepConnector}></div>

          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepIcon}>
              <Heart size={32} style={{ color: '#8b5cf6' }} />
            </div>
            <h3 style={styles.stepTitle}>Create Profile</h3>
            <p style={styles.stepDescription}>
              Set up your profile with interests, availability, and what you can offer
            </p>
          </div>

          <div style={styles.stepConnector}></div>

          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepIcon}>
              <Sparkles size={32} style={{ color: '#10b981' }} />
            </div>
            <h3 style={styles.stepTitle}>Start Connecting</h3>
            <p style={styles.stepDescription}>
              Book sessions, chat instantly, and build meaningful connections
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Start Connecting?</h2>
          <p style={styles.ctaText}>Join thousands of people building meaningful friendships today</p>
          <div style={styles.ctaButtons}>
            <button 
              onClick={handleFindFriend}
              style={styles.ctaPrimaryBtn}
            >
              Get Started Free
            </button>
            <button 
              onClick={handleBecomeFriend}
              style={styles.ctaSecondaryBtn}
            >
              Become a Friend
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerBrand}>
            <Heart size={24} style={{ color: '#6366f1' }} />
            <span style={styles.footerLogo}>Friend Finder</span>
          </div>
          <p style={styles.footerText}>
            © 2026 Friend Finder. Making connections that matter.
          </p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #e5e7eb',
    zIndex: 1000,
    padding: '16px 0'
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    letterSpacing: '-0.02em'
  },
  navButtons: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  navLoginBtn: {
    padding: '8px 20px',
    background: 'transparent',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  navSignupBtn: {
    padding: '8px 20px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
  },
  hero: {
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '120px 24px 80px',
    position: 'relative',
    overflow: 'hidden'
  },
  heroContent: {
    maxWidth: '700px',
    zIndex: 2,
    flex: 1
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'white',
    borderRadius: '100px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6366f1',
    marginBottom: '32px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
  },
  heroTitle: {
    fontSize: '64px',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '24px',
    lineHeight: '1.1',
    letterSpacing: '-0.03em'
  },
  gradient: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  heroSubtitle: {
    fontSize: '20px',
    color: '#6b7280',
    marginBottom: '40px',
    lineHeight: '1.7',
    fontWeight: '400',
    maxWidth: '600px'
  },
  ctaButtons: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '48px'
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 32px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
    transition: 'all 0.3s ease'
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 32px',
    background: 'white',
    color: '#111827',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  socialProof: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  proofItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  proofDivider: {
    color: '#d1d5db',
    fontSize: '20px'
  },
  heroImageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px'
  },
  heroImageGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
    maxWidth: '300px'
  },
  floatingCard1: {
    background: 'white',
    padding: '28px',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    animation: 'float 4s ease-in-out infinite',
    animationDelay: '0s'
  },
  floatingCard2: {
    background: 'white',
    padding: '28px',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    animation: 'float 4s ease-in-out infinite',
    animationDelay: '1.3s',
    marginLeft: '40px'
  },
  floatingCard3: {
    background: 'white',
    padding: '28px',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    animation: 'float 4s ease-in-out infinite',
    animationDelay: '2.6s'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    margin: '12px 0 4px',
    letterSpacing: '-0.01em'
  },
  cardSubtitle: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
    fontWeight: '500'
  },
  stats: {
    padding: '80px 24px',
    background: 'white',
    borderTop: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb'
  },
  statsContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '48px',
    textAlign: 'center'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  statNumber: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#6366f1',
    letterSpacing: '-0.02em'
  },
  statLabel: {
    fontSize: '16px',
    color: '#6b7280',
    fontWeight: '600'
  },
  features: {
    padding: '120px 24px',
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'white'
  },
  featuresHeader: {
    textAlign: 'center',
    marginBottom: '80px'
  },
  sectionTitle: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '16px',
    letterSpacing: '-0.02em'
  },
  sectionSubtitle: {
    fontSize: '20px',
    color: '#6b7280',
    fontWeight: '400',
    maxWidth: '600px',
    margin: '0 auto'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '32px'
  },
  featureCard: {
    padding: '40px 32px',
    borderRadius: '16px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease'
  },
  featureIconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '12px',
    letterSpacing: '-0.01em'
  },
  featureDescription: {
    fontSize: '15px',
    color: '#6b7280',
    lineHeight: '1.7',
    fontWeight: '400'
  },
  howItWorks: {
    padding: '120px 24px',
    background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
    borderTop: '1px solid #e5e7eb'
  },
  stepsContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: '24px',
    flexWrap: 'wrap'
  },
  step: {
    flex: '1',
    minWidth: '280px',
    maxWidth: '350px',
    textAlign: 'center',
    position: 'relative'
  },
  stepNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#6366f1',
    color: 'white',
    fontSize: '18px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
  },
  stepIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb'
  },
  stepTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '12px',
    letterSpacing: '-0.01em'
  },
  stepDescription: {
    fontSize: '15px',
    color: '#6b7280',
    lineHeight: '1.7',
    fontWeight: '400'
  },
  stepConnector: {
    width: '60px',
    height: '2px',
    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
    marginTop: '80px',
    borderRadius: '2px'
  },
  ctaSection: {
    padding: '120px 24px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
    color: 'white'
  },
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center'
  },
  ctaTitle: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '20px',
    letterSpacing: '-0.02em'
  },
  ctaText: {
    fontSize: '20px',
    marginBottom: '48px',
    opacity: 0.95,
    fontWeight: '400',
    lineHeight: '1.6'
  },
  ctaPrimaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '18px 40px',
    background: 'white',
    color: '#6366f1',
    border: 'none',
    borderRadius: '12px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease'
  },
  ctaSecondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '18px 40px',
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '12px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  footer: {
    padding: '48px 24px',
    background: '#ffffff',
    borderTop: '1px solid #e5e7eb'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  },
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  footerLogo: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827'
  },
  footerText: {
    color: '#6b7280',
    fontSize: '14px',
    margin: 0,
    fontWeight: '500'
  }
};

export default LandingPage;
