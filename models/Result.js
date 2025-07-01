import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    testid: {
        type: String,
        required: true
    },
    answers: [
        {
            type: Object
        }
    ]
});

const User = mongoose.model('Result', resultSchema);

export default User;
