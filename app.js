import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import groupRoutes from './routes/groupRoutes.js'; 

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// CORS + JSON
const allowedOrigins = [
  'http://localhost:3000',
  'https://backend.dedebono.uk',
  'https://www.mlbchurch.online',
];

app.use(cors({
  origin: (origin, cb) => (!origin || allowedOrigins.includes(origin)) ? cb(null, true) : cb(new Error('CORS blocked'), false),
  credentials: true
}));
app.use(express.json());

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB with Mongoose'))
  .catch(err => console.error('❌ Mongoose connection error:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/api/groups', groupRoutes);

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Body:', req.body);
  console.log('Params:', req.params);
  console.log('Query:', req.query);
  next();
});
