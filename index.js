import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import ExamRoutes from './Routes.js';
import dbConnect from './config/database.js';
dotenv.config();

// const corsOptions = {
//     origin: 'https://sohamtamhane.github.io', // Or an array of allowed origins
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true, // If you need to send cookies or authorization headers
//     optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// Server Configuration
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5002;
const server = http.createServer(app);
dbConnect();

// API Routing
app.use('/api/v1/exam', ExamRoutes);

server.listen(PORT, () => {
    console.log(`Examination Service Started at PORT: ${PORT}`);
});