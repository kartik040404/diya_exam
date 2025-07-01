import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function dbConnect() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Exam DB Connected Successfully!');
    } catch (error) {
        console.error('Exam DB Connection Error:', error.message);
        process.exit(1);
    }
}

export default dbConnect;
