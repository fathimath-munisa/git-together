import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    lastName: {
        type: String,
        minlength: 4,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 16
    },
    gender: { 
        type: String,
        validate: {
            validator: function(v) {
                return ['male', 'female', 'other'].includes(v);
            },
            message: props => `${props.value} is not a valid gender`
        },
        required: true
    },
    photoUrl: {
        type: String,
        default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    },
    default: {
        type: String,
        default: "This user prefers to keep an air of mystery about them."
    },
    skills: {
        type: [String]
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;