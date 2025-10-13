import jwt from "jsonwebtoken";
import User from "../models/user.js";

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies;
        if (!token) {
            throw new Error('Token is not valid');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

export {userAuth};