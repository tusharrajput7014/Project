import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Heart, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'friend') {
      setUserType('provider');
    } else {
      setUserType('user');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await register(email, password, userType);
      } else {
        await login(email, password);
      }
      navigate(userType === 'provider' ? '/provider/dashboard' : '/user/dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={() => navigate('/')} style={styles.backButton}>
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div style={styles.header}>
          <Heart size={40} style={{ color: '#0f766e' }} />
          <h1 style={styles.title}>
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={styles.subtitle}>
            {userType === 'provider' 
              ? 'Register as a Friend to help others' 
              : 'Looking for a Friend? Sign in here'}
          </p>
        </div>
        
        <div style={styles.userTypeSelector}>
          <button
            type="button"
            onClick={() => setUserType('user')}
            style={{
              ...styles.userTypeButton,
              ...(userType === 'user' ? styles.userTypeButtonActive : {})
            }}
          >
            <UserCircle size={24} />
            <span>Looking for Friend</span>
          </button>
          <button
            type="button"
            onClick={() => setUserType('provider')}
            style={{
              ...styles.userTypeButton,
              ...(userType === 'provider' ? styles.userTypeButtonActive : {})
            }}
          >
            <Heart size={24} />
            <span>Register as Friend</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="your@email.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            style={styles.toggleButton}
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)',
    padding: '20px'
  },
  card: {
    background: '#0a0a0a',
    borderRadius: '16px',
    padding: '48px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    position: 'relative',
    border: '1px solid #222222'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: '#111111',
    border: '1px solid #333333',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
    marginBottom: '32px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '36px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    textAlign: 'center',
    margin: 0,
    color: '#ffffff',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    fontSize: '15px',
    color: '#999999',
    textAlign: 'center',
    margin: 0
  },
  userTypeSelector: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px'
  },
  userTypeButton: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    padding: '18px',
    border: '2px solid #333333',
    borderRadius: '12px',
    background: '#0a0a0a',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '14px',
    fontWeight: '600',
    color: '#999999'
  },
  userTypeButtonActive: {
    borderColor: '#ffffff',
    background: '#111111',
    color: '#ffffff'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff'
  },
  input: {
    padding: '14px 16px',
    border: '2px solid #333333',
    borderRadius: '10px',
    fontSize: '15px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    color: '#ffffff',
    background: '#111111'
  },
  submitButton: {
    padding: '16px',
    background: 'white',
    color: '#000000',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.25)'
  },
  toggleText: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#999999'
  },
  toggleButton: {
    marginLeft: '6px',
    color: '#ffffff',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

export default Login;
