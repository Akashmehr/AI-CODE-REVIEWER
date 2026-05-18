import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Review from '../models/Review';
import { reviewCode } from '../services/aiService';


export const analyzeCode = async (req: AuthRequest, res: Response) => {

    const { code, language } = req.body;

    if (!code || !language) {
        return res.status(400).json({ message: 'Code and language are required.' });
    }

    try {
        console.log(`🤖 Sending ${language} code to Gemini AI...`);
        const feedback = await reviewCode(code, language);
        console.log('✅ AI feedback received!');

        const review = await Review.create({
            userId: req.userId,
            code,
            language,
            feedback,
        });

        res.status(201).json(review);

    } catch (error) {
        console.error('Review error:', error);
        res.status(500).json({ message: 'AI review failed. Please try again.' });
    }
};


// ─── GET HISTORY CONTROLLER ───────────────────────────────────
export const getHistory = async (req: AuthRequest, res: Response) => {
    try {
        const reviews = await Review.find({ userId: req.userId })
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);

    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ message: 'Could not fetch history.' });
    }
};


// ─── DELETE REVIEW CONTROLLER ─────────────────────────────────
export const deleteReview = async (req: AuthRequest, res: Response) => {
    try {
        await Review.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Review deleted successfully.' });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Could not delete review.' });
    }
};