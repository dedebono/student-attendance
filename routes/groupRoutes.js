import express from 'express';
import Group from '../models/group.js';

const router = express.Router();

// CREATE a group
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        const group = new Group({ name, description });
        await group.save();
        res.status(201).send(group);
    } catch (error) {
        res.status(400).send(error);
    }
});

// READ all groups
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).send(groups);
    } catch (error) {
        res.status(400).send(error);
    }
});

// READ single group by ID
router.get('/:id', async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).send('Group not found');
        }
        res.status(200).send(group);
    } catch (error) {
        res.status(400).send(error);
    }
});

// UPDATE a group
router.patch('/groups/:id', async (req, res) => {
    try {
        const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!group) {
            return res.status(404).send('Group not found');
        }
        res.status(200).send(group);
    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE a group
router.delete('/groups/:id', async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);
        if (!group) {
            return res.status(404).send('Group not found');
        }
        res.status(200).send({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
});

export default router;
