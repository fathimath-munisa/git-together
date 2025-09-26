import express from 'express';

const router = express.Router();

router.delete('/user', (req, res) => {
    const { email } = req.body;
    // Logic to delete user by email
    User.findOneAndDelete({ email: email }).then(user => {
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(`User with email ${email} deleted`);
    }).catch(err => {
        console.error(err);
        res.status(500).send('Server error');
    });
    res.send(`User with email ${email} deleted`);
})

router.patch('/user/:userId', (req, res) => {
    const userId = req.params.id;
    const data = req.body;

    const ALLOWED_UPDATES = ['firstName', 'lastName', 'password', 'age', 'gender', 'about', 'photoUrl', 'skills']  
    
    const isValidOperation = Object.keys(data).every(update => ALLOWED_UPDATES.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    
    User.findByIdAndUpdate({ _id: userId }, data, {
         returnDocument: "after",  
         runValidators: true
        }).then(user => {
        if (!user) {
            return res.status(404).send('User not found');
        }
    }).catch(err => {
        console.error(err);
        res.status(500).send('Server error');
    });
    res.send(`User with email ${email} updated`);
})

export default router;