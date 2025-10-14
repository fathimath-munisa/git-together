import express from "express";
import { userAuth } from "../middlewares/auth.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/connections", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const connections = user.connections || [];
        res.send({ connections });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
})

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromId = req.user._id;
        const { toUserId, status } = req.params;
        if (!toUserId || !status) {
            return res.status(400).json({ message: "toUserId and status are required" });
        }

        const allowedStatuses = ['ignored', 'interested'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "Target user not found" });
        }

        const existingRequest = await ConnectionRequest.findOne({$or: [
            { fromRequestId: fromId, toRequestId: toUserId },
            { fromRequestId: toUserId, toRequestId: fromId }
        ]});

        if (existingRequest) {
            return res.status(400).json({ message: "Connection request already sent" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
})    

router.post("/request/review/:status/:fromUserId", userAuth, async (req, res) => {
    try {
        const toId = req.user._id;
        const { fromUserId, status } = req.params;


        if (!fromUserId || !status) {
            return res.status(400).json({ message: "fromUserId and status are required" });
        }

        const allowedStatuses = ['rejected', 'accepted'];    
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const connectionRequest = await ConnectionRequest.findOne({ fromRequestId: fromUserId, toRequestId: toId });
        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        if (connectionRequest.status !== 'interested') {
            return res.status(400).json({ message: "Connection request already reviewed" });
        }
        
        connectionRequest.status = status;
        await connectionRequest.save();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
})          

export default router;