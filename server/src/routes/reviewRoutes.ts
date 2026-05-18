import { Router } from 'express';
import { analyzeCode, getHistory, deleteReview } from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/analyze', protect, analyzeCode);

router.get('/history', protect, getHistory);

router.delete('/:id', protect, deleteReview);

export default router;