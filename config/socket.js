const { Server } = require('socket.io');

/**
 * Socket.IO Configuration
 * 
 * WHY: Enables real-time bidirectional communication
 * Allows instant updates across all connected clients
 * 
 * WebSockets vs HTTP:
 * - HTTP: Request-response, connection closes after each request
 * - WebSockets: Persistent connection, server can push data anytime
 * 
 * When to use WebSockets:
 * - Real-time dashboards
 * - Live notifications
 * - Chat applications
 * - Collaborative editing
 * - Live sports scores
 * - Stock market updates
 */

let io = null;

/**
 * Initialize Socket.IO server
 * @param {http.Server} server - HTTP server instance
 */
const initSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    // Ping settings to keep connection alive
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Connection event - fired when client connects
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle client disconnection
    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error (${socket.id}):`, error);
    });
  });

  console.log('Socket.IO initialized');
  return io;
};

/**
 * Get Socket.IO instance
 * Use this to emit events from controllers
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized! Call initSocketIO first.');
  }
  return io;
};

/**
 * Emit student creation event to all clients
 * @param {Object} student - Created student data
 */
const emitStudentCreated = (student) => {
  if (io) {
    io.emit('student:created', {
      message: 'New student added',
      student,
      timestamp: new Date().toISOString()
    });
    console.log(`Emitted student:created event for ${student._id || student.id}`);
  }
};

/**
 * Emit student update event to all clients
 * @param {Object} student - Updated student data
 */
const emitStudentUpdated = (student) => {
  if (io) {
    io.emit('student:updated', {
      message: 'Student updated',
      student,
      timestamp: new Date().toISOString()
    });
    console.log(`Emitted student:updated event for ${student._id || student.id}`);
  }
};

/**
 * Emit student deletion event to all clients
 * @param {String} studentId - Deleted student ID
 */
const emitStudentDeleted = (studentId) => {
  if (io) {
    io.emit('student:deleted', {
      message: 'Student deleted',
      studentId,
      timestamp: new Date().toISOString()
    });
    console.log(`Emitted student:deleted event for ${studentId}`);
  }
};

module.exports = {
  initSocketIO,
  getIO,
  emitStudentCreated,
  emitStudentUpdated,
  emitStudentDeleted
};
