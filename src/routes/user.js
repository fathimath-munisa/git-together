import express from 'express';
import User from '../models/user.js';
import ConnectionRequests from '../models/connectionRequest.js';

const router = express.Router();

const USER_DATA_FIELDS = 'firstName lastName age gender about photoUrl skills';

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

    if (data.skills > 10) {
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

router.get('/user/requests/received', async (req, res) => {
    try {
        let loggedUser = req.user;
        const connectionRequests = await ConnectionRequests
            .find({ toRequestId: loggedUser._id, status: 'interested' })
            .populate('fromRequestId', USER_DATA_FIELDS);

        res.status(200).json({
            message: "Data fetched successfully",
            data: connectionRequests
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/user/connections', async (req, res) => {
    try {
        let loggedUser = req.user;

        const connections = await ConnectionRequests.find({
            $or: [
                { fromRequestId: loggedUser._id, status: 'accepted' },
                { toRequestId: loggedUser._id, status: 'accepted' }
            ].populate('fromRequestId', USER_DATA_FIELDS)
                .populate('toRequestId', USER_DATA_FIELDS)
        });

        const data = connections.map(connection => {
            if (connection.fromRequestId._id.toString() === loggedUser._id.toString()) {
                return connection.toRequestId;
            } else {
                return connection.fromRequestId;
            }
        });

        res.status(200).json({
            message: "Data fetched successfully",
            data: data
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

export default router;