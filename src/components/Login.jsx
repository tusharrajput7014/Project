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
          <Heart size={40} style={{ color: '#667eea' }} />
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    position: 'relative'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    background: '#f7fafc',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
    cursor: 'pointer',
    marginBottom: '24px'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '30px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    textAlign: 'center',
    margin: 0,
    color: '#1a202c'
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096',
    textAlign: 'center',
    margin: 0
  },
  userTypeSelector: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px'
  },
  userTypeButton: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: '500'
  },
  userTypeButtonActive: {
    borderColor: '#667eea',
    background: '#f7fafc',
    color: '#667eea'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568'
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    transition: 'border-color 0.2s',
    outline: 'none'
  },
  submitButton: {
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'transform 0.2s'
  },
  toggleText: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#718096'
  },
  toggleButton: {
    marginLeft: '5px',
    color: '#667eea',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  }
};

export default Login;
