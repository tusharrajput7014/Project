import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ServiceProvider } from './context/ServiceContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import FriendRequests from './components/FriendRequests';
import ChatList from './components/ChatList';
import ProviderDashboard from './components/ProviderDashboard';
import UserDashboard from './components/UserDashboard';
import Chat from './components/Chat';
import VideoCall from './components/VideoCall';
import Payment from './components/Payment';
import Wallet from './components/Wallet';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredType }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredType && user.userType !== requiredType) {
    return <Navigate to={user.userType === 'provider' ? '/provider/dashboard' : '/home'} replace />;
  }

  return children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.userType === 'provider' ? '/provider/dashboard' : '/home'} replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={user.userType === 'provider' ? '/provider/dashboard' : '/home'} replace /> : <Login />} />
      
      <Route
        path="/home"
        element={
          <ProtectedRoute requiredType="user">
            <Home />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/provider/dashboard"
        element={
          <ProtectedRoute requiredType="provider">
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute requiredType="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/friend-requests"
        element={
          <ProtectedRoute>
            <FriendRequests />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/chats"
        element={
          <ProtectedRoute>
            <ChatList />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/chat/:bookingId"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/video/:bookingId"
        element={
          <ProtectedRoute>
            <VideoCall />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/payment"
        element={
          <ProtectedRoute requiredType="user">
            <Payment />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ServiceProvider>
          <AppContent />
        </ServiceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
