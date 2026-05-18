import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import User from './models/User';
import authRoutes from './routes/authRoutes';
import reviewRoutes from './routes/reviewRoutes';


dotenv.config();

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://ai-code-reviewer-rho-jade.vercel.app',
        // Add any other vercel URLs you saw earlier
        'https://ai-code-reviewer-git-main-akashmehrs-projects.vercel.app',
        'https://ai-code-reviewer-cns7nf50n-akashmehrs-projects.vercel.app',
    ],
    credentials: true,
}));

app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/review', reviewRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'AI Code Reviewer API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});