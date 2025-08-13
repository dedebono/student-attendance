import express from 'express';
import Member from '../models/member.js';

const router = express.Router();

// CREATE a member
router.post('/members', async (req, res) => {
    try {
        const { name, email, group } = req.body;
        const member = new Member({ name, email, group });
        await member.save();
        res.status(201).send(member);
    } catch (error) {
        res.status(400).send(error);
    }
});

// READ all members
router.get('/members', async (req, res) => {
    try {
        const members = await Member.find().populate('group');
        res.status(200).send(members);
    } catch (error) {
        res.status(400).send(error);
    }
});

// READ single member by ID
router.get('/members/:id', async (req, res) => {
    try {
        const member = await Member.findById(req.params.id).populate('group');
        if (!member) {
            return res.status(404).send('Member not found');
        }
        res.status(200).send(member);
    } catch (error) {
        res.status(400).send(error);
    }
});

// UPDATE a member
router.patch('/members/:id', async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!member) {
            return res.status(404).send('Member not found');
        }
        res.status(200).send(member);
    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE a member
router.delete('/members/:id', async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).send('Member not found');
        }
        res.status(200).send({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
});

export default router;
