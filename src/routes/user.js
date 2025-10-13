import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.delete('/user', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(`User with email ${email} deleted`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.patch('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;

    const ALLOWED_UPDATES = ['firstName', 'lastName', 'password', 'age', 'gender', 'about', 'photoUrl', 'skills'];
    const isValidOperation = Object.keys(data).every(update => ALLOWED_UPDATES.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    if(data.skills > 10)   {
        return res.status(400).send({ error: 'You can add up to 10 skills only' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            data,
            { returnDocument: "after", runValidators: true }
        );
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(`User with ID ${userId} updated`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

export default router;