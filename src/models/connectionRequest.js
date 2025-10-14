const connecttionRequestSchema = new mongoose.Schema({
    fromRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'interested', 'rejected', 'accepted'],
            message: '{VALUE} is not a valid status'
        },
        default: 'interested'
    }
}, { timestamps: true });

connecttionRequestSchema.index({ fromRequestId: 1, toRequestId: 1 });

connecttionRequestSchema.pre('save', async function (next) {
    if (this.fromRequestId.toString() === this.toRequestId.toString()) {
        throw new Error("Cannot send connection request to yourself");
    }
    next();
});

const ConnectionRequest = mongoose.model('ConnectionRequest', connecttionRequestSchema);
export default ConnectionRequest;   