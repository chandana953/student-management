require('dotenv').config();
const http = require('http');
const app = require("./app");
const { initSocketIO } = require('./config/socket');

const PORT = process.env.PORT || 3000;

// Create HTTP server (required for Socket.IO)
const server = http.createServer(app);

// Initialize Socket.IO
initSocketIO(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket ready for real-time updates`);
});