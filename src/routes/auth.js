import express from 'express';
import User from '../models/user.js';
import { validateSignupData } from '../utils/validation.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        validateSignupData(req);
        const { firstName, lastName, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, password: passwordHash });

        const savedUser = await newUser.save();
        const token  = savedUser.getJWT();
        res.cookie('token', token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production' });
        res.send('User registered successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error registering user', error.message);
    }
    
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).send('Invalid email or password');
        }

        const isMatch = await user.validatePassword(password);
        if(!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        const token = await user.getJWT();
        res.cookie('token', token, { 
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production'
         });
        res.send('Login successful');
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
})

export default router;