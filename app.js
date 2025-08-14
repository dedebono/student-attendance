import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import groupRoutes from './routes/groupRoutes.js';
import authRoutes from './routes/authRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import AttendanceLog from './models/attendanceLog.js';
import Member from './models/member.js';  // Import Member model

dotenv.config();
const app = express();
const server = createServer(app);
const PORT = process.env.PORT;

// CORS + JSON
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3001'], // frontend URL
    methods: ['GET', 'POST'],
  }
});

// Allowed Origins for CORS
const allowedOrigins = [
  'http://localhost:3000',
  'https://backend.dedebono.uk',
  'https://www.mlbchurch.online',
];

app.use(
  cors({
    origin: (origin, cb) =>
      !origin || allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error('CORS blocked'), false),
    credentials: true,
  })
);
app.use(express.json());

mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB with Mongoose'))
  .catch((err) => console.error('❌ Mongoose connection error:', err));

// WebSocket connection for real-time events
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Handling the markPresent event when the member scans their ID
  socket.on('markPresent', async (memberCardNumber) => {
    console.log('Received markPresent for memberCardNumber:', memberCardNumber); // Log event receipt

    try {
      // Find member by `memberCardNumber` (string)
      const member = await Member.findOne({ memberCardNumber });
      if (!member) {
        console.error('Member not found!');
        return socket.emit('error', 'Member not found');
      }

      // Create an attendance log for present
      const log = new AttendanceLog({
        memberId: member._id,
        status: 'present',
      });
      await log.save();

      // Emit the update to all connected clients
      io.emit('attendanceUpdated', {
        member: member.fullName,
        status: 'present',
        time: new Date(),
      });

      console.log('Attendance updated for member:', member.fullName);
    } catch (error) {
      console.error('Error while saving attendance log:', error); // Log error
    }
  });

  // Handle socket disconnects
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Routes for API endpoints
app.use('/api/groups', groupRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);

// Logging middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Body:', req.body);
  console.log('Params:', req.params);
  console.log('Query:', req.query);
  next();
});
