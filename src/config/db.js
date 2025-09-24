import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(process.env.DB_URI);
}

export default connectDB;