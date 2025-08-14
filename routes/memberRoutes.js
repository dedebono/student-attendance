import express from 'express';
import Member from '../models/member.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import AttendanceLog from '../models/attendanceLog.js';

const router = express.Router();

// CREATE a member (Admin, Teacher only)
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const { 
            fullName, 
            gender,
            dateOfBirth, 
            memberCardNumber 
        } = req.body;
        
        const member = new Member({ 
            fullName, 
            gender, 
            dateOfBirth,
            memberCardNumber });
        await member.save();
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/logs', async (req, res) => {
  try {
    const logs = await AttendanceLog.find()
      .populate({
        path: 'memberId', // Populate the memberId field
        select: 'fullName memberCardNumber' // Include only necessary fields from the Member model
      })
      .exec();

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search for attendance logs by member's full name
router.get('/logs/search', async (req, res) => {
  const { memberName } = req.query; // Get member name from query params

  try {
    // Find attendance logs for the member by their name (case-insensitive search)
    const logs = await AttendanceLog.find()
      .populate({
        path: 'memberId',
        match: { fullName: new RegExp(memberName, 'i') }, // Case-insensitive search for fullName
        select: 'fullName' // Only return the fullName of the member
      })
      .exec();

    // Filter out logs where memberId is null (in case no matching member is found)
    const filteredLogs = logs.filter(log => log.memberId);

    if (filteredLogs.length === 0) {
      return res.status(404).json({ message: 'No attendance logs found for the given member name.' });
    }

    res.status(200).json(filteredLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search for members by name (using query params)
router.get('/search', async (req, res) => {
  const { name } = req.query; // Get name from query params

  try {
    // Find members by their fullName (case-insensitive)
    const members = await Member.find({
      fullName: new RegExp(name, 'i') // Case-insensitive search
    });

    if (members.length === 0) {
      return res.status(404).json({ message: 'No members found with the given name.' });
    }

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ all members (Any logged-in user)
router.get('/',protect, async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// READ single member (Any logged-in user)
router.get('/:id', protect, async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE member (Admin, Teacher only)
router.patch('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const updated = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Member not found' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE member (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const deleted = await Member.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Member not found' });
        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/members/:memberCardNumber/dismiss
router.post('/:memberCardNumber/dismiss', async (req, res) => {
  try {
    const memberCardNumber = req.params.memberCardNumber;

    // Find the member by memberCardNumber
    const member = await Member.findOne({ memberCardNumber });
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Create attendance log for dismissal
    const log = new AttendanceLog({
      memberId: member._id,
      status: 'dismissed'
    });
    await log.save();

    // Emit Socket.IO event for real-time updates
    req.io.emit('dismissalNotification', { member: member.fullName, time: new Date() });

    res.status(200).json({ message: 'Member dismissed and logged', log });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example: mark as present using memberCardNumber
router.post('/:memberCardNumber/present', async (req, res) => {
  try {
    const memberCardNumber = req.params.memberCardNumber;

    // Find the member by memberCardNumber
    const member = await Member.findOne({ memberCardNumber });
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Create attendance log for presence
    const log = new AttendanceLog({
      memberId: member._id,
      status: 'present'
    });
    await log.save();

    // Emit Socket.IO event for real-time updates
    req.io.emit('attendanceUpdated', { member: member.fullName, time: new Date() });

    res.status(200).json({ message: 'Member marked as present', log });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get('/logs', async (req, res) => {
  try {
    const logs = await AttendanceLog.find().populate('memberId', 'name');
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
