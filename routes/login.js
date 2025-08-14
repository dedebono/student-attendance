//login

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Member from '../models/member.js';

// Login route to authenticate using email/username and password
export const loginMember = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the member by username or email
        const member = await Member.findOne({ username });
        if (!member) return res.status(400).json({ message: 'Invalid username or password' });

        // Compare password
        const isMatch = await bcrypt.compare(password, member.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

        // Generate JWT token
        const token = jwt.sign({ id: member._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            member: {
                id: member._id,
                fullName: member.fullName,
                username: member.username,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
