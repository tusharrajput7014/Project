import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            ...userDoc.data()
          };
          setUser(userData);
          
          // Set user as online
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            isOnline: true,
            lastSeen: serverTimestamp()
          });
        }
      } else {
        // Set user as offline when logged out
        if (user) {
          await updateDoc(doc(db, 'users', user.id), {
            isOnline: false,
            lastSeen: serverTimestamp()
          });
        }
        setUser(null);
      }
      setLoading(false);
    });

    // Set user offline when window closes
    const handleBeforeUnload = async () => {
      if (user) {
        await updateDoc(doc(db, 'users', user.id), {
          isOnline: false,
          lastSeen: serverTimestamp()
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email, password, userType, additionalData = {}) => {
    try {
      // Create auth user
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      // Create user document in Firestore
      const userData = {
        email,
        userType,
        name: email.split('@')[0],
        isOnline: true,
        interests: [],
        bio: '',
        location: '',
        ...additionalData,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      return firebaseUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Set offline before logging out
      if (user) {
        await updateDoc(doc(db, 'users', user.id), {
          isOnline: false,
          lastSeen: serverTimestamp()
        });
      }
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (auth.currentUser) {
        // Update Firebase auth profile if name changed
        if (updates.name) {
          await updateFirebaseProfile(auth.currentUser, {
            displayName: updates.name
          });
        }

        // Update Firestore document
        await setDoc(doc(db, 'users', user.id), updates, { merge: true });

        // Update local state
        setUser({ ...user, ...updates });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
    isProvider: user?.userType === 'provider',
    isUser: user?.userType === 'user'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
