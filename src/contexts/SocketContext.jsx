import { createContext, useContext, useEffect, useState } from 'react';
import socketService from '../api/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to socket
      socketService.connect();
      setSocket(socketService.getSocket());

      // Join personal room for notifications
      if (user._id) {
        socketService.joinPersonalRoom(user._id);
      }

      // Subscribe to dashboard based on role
      if (user.role) {
        socketService.subscribeToDashboard(user.role);
      }

      return () => {
        // Cleanup on unmount
        if (user._id) {
          socketService.leavePersonalRoom(user._id);
        }
        if (user.role) {
          socketService.unsubscribeFromDashboard(user.role);
        }
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};