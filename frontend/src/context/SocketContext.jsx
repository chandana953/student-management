import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

/**
 * Socket.IO Context
 * 
 * WHY: Provides WebSocket connection to all components
 * Enables real-time updates across the application
 * 
 * WebSocket Benefits:
 * - Instant updates without page refresh
 * - Server can push data to clients
 * - Bidirectional communication
 * 
 * Events Handled:
 * - student:created - New student added
 * - student:updated - Student modified
 * - student:deleted - Student removed
 */

const SocketContext = createContext(null);

// Backend WebSocket URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'wss://student-management-eg5j.onrender.com';

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection established
    socketInstance.on('connect', () => {
      console.log('WebSocket connected:', socketInstance.id);
      setConnected(true);
    });

    // Connection lost
    socketInstance.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setConnected(false);
    });

    // Connection error
    socketInstance.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
      setConnected(false);
    });

    // Real-time events
    socketInstance.on('student:created', (data) => {
      console.log('Real-time: Student created', data);
      setLastEvent({ type: 'created', data });
    });

    socketInstance.on('student:updated', (data) => {
      console.log('Real-time: Student updated', data);
      setLastEvent({ type: 'updated', data });
    });

    socketInstance.on('student:deleted', (data) => {
      console.log('Real-time: Student deleted', data);
      setLastEvent({ type: 'deleted', data });
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Clear last event after it's been consumed
  const clearLastEvent = () => setLastEvent(null);

  const value = {
    socket,
    connected,
    lastEvent,
    clearLastEvent,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

/**
 * Hook to use Socket.IO context
 * 
 * Usage:
 * const { connected, lastEvent, clearLastEvent } = useSocket();
 * 
 * if (lastEvent?.type === 'created') {
 *   // Handle new student
 *   clearLastEvent();
 * }
 */
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export default SocketContext;
