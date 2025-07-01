import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: {
        type: Date,
    },
    maxTime: {
        type: Date,
    },
    bufferTime: {
        type: Number,
        default: 10 * 60 * 1000,
    },
    duration: {
        type: Number,
        required: true,
    },
    question: [
        {
            type: Object
        }
    ]
});


sessionSchema.pre('save', function (next) {
    if (!this.endTime && this.duration) {
        const durationMs = this.duration * 60 * 60 * 1000;
        this.endTime = new Date(this.startTime.getTime() + durationMs);
    }

    if (this.endTime && this.bufferTime) {
        this.maxTime = new Date(this.endTime.getTime() + this.bufferTime);
    }

    next();
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;
