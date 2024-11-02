const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const foodRoutes = require('./routes/food.routes');
const userRoutes = require('./routes/user.routes');
const orderRoutes = require('./routes/order.routes');
require('dotenv').config();

const app = express();
const server = http.createServer(app); // Create HTTP server

// Serve the frontend
app.use(express.static('public'));
app.use(cors());
app.use(express.json());

// Socket.IO setup
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173', // Your React frontend URL
    methods: ['GET', 'POST'],
  },
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB', err));

let connectedUsers = [];

// Handle client connections with Socket.IO
io.on('connection', (socket) => {
  // Private Chat
  // socket.on('register', (username) => {
  //   connectedUsers.push({ name: username, socketID: socket.id }); // Map username to socket ID
  //   console.log(`${username} has joined with socket ID: ${socket.id}`);
  //   socket.emit('user-connected-list', connectedUsers);
  // });
  // socket.on('get-user-list', (username) => {
  //   socket.emit('get-users-list', connectedUsers);
  // });
  // // Send Private Message
  // socket.on('privateMessage', ({ sender, recipient, message }) => {
  //   console.log(recipient);
  //   if (recipient) {
  //     // Send message to the recipient
  //     socket.to(recipient).emit('receive-privateMessage', {
  //       recipient,
  //       message,
  //     });
  //     console.log(`Private message from ${sender} to ${recipient}: ${message}`);
  //   } else {
  //     console.log(`User ${recipient} is not connected`);
  //   }
  // });

  // Group Chat
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Sending messages in a room
  socket.on('sendMessage', ({ room, message, user }) => {
    io.to(room).emit('receiveMessage', { user, message });
  });

  // Public Chat
  // socket.on('send-notification', (data) => {
  //   io.emit('receive-notification', data); // Broadcast notification to all clients
  // });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Routes
app.use('/food', foodRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

// Start the server using server.listen() to handle both Express and Socket.IO
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
