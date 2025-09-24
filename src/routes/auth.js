import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const newUser = new User({ firstName, lastName, email, password });
    try {
        await newUser.save();
        res.send('User registered successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error registering user', error.message);
    }
    
})

export default router;