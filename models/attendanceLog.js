// models/attendanceLog.js
import mongoose from 'mongoose';

const attendanceLogSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  status: { type: String, enum: ['present', 'dismissed'], required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('AttendanceLog', attendanceLogSchema);
