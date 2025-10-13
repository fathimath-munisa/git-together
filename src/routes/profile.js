import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.post("/profile", async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.token) {
        return res.status(401).send("Unauthorized: No token provided");
    }
    const decoded = jwt.verify(cookie.token, process.env.JWT_SECRET);
    try {
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
})