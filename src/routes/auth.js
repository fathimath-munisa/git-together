import express from 'express';
import User from '../models/user.js';
import { validateSignupData } from '../utils/validation.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        validateSignupData(req);
        const { firstName, lastName, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, passwordHash });

        const savedUser = await newUser.save();
        const token  = savedUser.getJWT();
        cons
        res.send('User registered successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error registering user', error.message);
    }
    
})

export default router;