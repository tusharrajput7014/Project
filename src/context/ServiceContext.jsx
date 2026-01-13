import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const ServiceContext = createContext(null);

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Real-time listener for all services
    const unsubscribeServices = onSnapshot(
      collection(db, 'services'),
      (snapshot) => {
        const servicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setServices(servicesData);
      }
    );

    // Real-time listener for all bookings
    const unsubscribeBookings = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        const bookingsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBookings(bookingsData);
      }
    );

    return () => {
      unsubscribeServices();
      unsubscribeBookings();
    };
  }, []);

  const addService = async (service) => {
    try {
      const newService = {
        ...service,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      const docRef = await addDoc(collection(db, 'services'), newService);
      return { id: docRef.id, ...newService };
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  };

  const updateService = async (id, updates) => {
    try {
      await updateDoc(doc(db, 'services', id), updates);
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  };

  const deleteService = async (id) => {
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  };

  const createBooking = async (booking) => {
    try {
      const newBooking = {
        ...booking,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'bookings'), newBooking);
      return { id: docRef.id, ...newBooking };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const updateBooking = async (id, updates) => {
    try {
      await updateDoc(doc(db, 'bookings', id), updates);
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  };

  const getServicesByProvider = (providerId) => {
    return services.filter(service => service.providerId === providerId);
  };

  const getBookingsByUser = (userId) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const getBookingsByProvider = (providerId) => {
    return bookings.filter(booking => booking.providerId === providerId);
  };

  const value = {
    services,
    bookings,
    addService,
    updateService,
    deleteService,
    createBooking,
    updateBooking,
    getServicesByProvider,
    getBookingsByUser,
    getBookingsByProvider
  };

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};
