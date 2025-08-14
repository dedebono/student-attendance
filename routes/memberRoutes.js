import express from 'express';
import Member from '../models/member.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// CREATE a member (Admin, Teacher only)
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const { name, email, group } = req.body;
        const member = new Member({ name, email, group });
        await member.save();
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ all members (Any logged-in user)
router.get('/', protect, async (req, res) => {
    try {
        const members = await Member.find().populate('group');
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ single member (Any logged-in user)
router.get('/:id', protect, async (req, res) => {
    try {
        const member = await Member.findById(req.params.id).populate('group');
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

export default router;
