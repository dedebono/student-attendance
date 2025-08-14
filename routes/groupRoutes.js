import express from 'express';
import Group from '../models/group.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// CREATE group (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const group = new Group({ name, description });
        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ all groups (Any logged-in user)
router.get('/', protect, async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ single group (Any logged-in user)
router.get('/:id', protect, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE group (Admin only)
router.patch('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const updated = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Group not found' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE group (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const deleted = await Group.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Group not found' });
        res.json({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;