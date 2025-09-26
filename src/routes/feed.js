import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.get('/user', (req, res) => {
    const { email } = req.query;
    User.findOne({email: email}).then(user => {
        if (!user) {
            return res.status(404).send('User not found');
        }
                                                                                                                        
        res.send(`Feed for user: ${user.firstName} ${user.lastName}`);
    }).catch(err => {
        console.error(err);
        res.status(500).send('Server error');
    });
})

router.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }   
})

export default router;

