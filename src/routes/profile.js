import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { validateEditProfileData } from "../utils/validation.js";

const router = express.Router();

router.post("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
})

router.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)) {
            return res.status(400).send("Invalid input data");
        }

        const user = req.user;
        Objeject.keys(req.body).forEach(key => user[key] = req.body[key]);
        await user.save();
        res.json({
            message: "Profile updated successfully",
            data: user
        })
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
})

export default router;