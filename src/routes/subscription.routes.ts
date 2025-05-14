import express from 'express';
import {
  subscribe,
  confirmSubscription,
  unsubscribe,
} from '@controllers/subscription.controller';

const router = express.Router();

// POST /api/subscribe
router.post('/subscribe', subscribe);

// GET /api/confirm/:token
router.get('/confirm/:token', confirmSubscription);

// GET /api/unsubscribe/:token
router.get('/unsubscribe/:token', unsubscribe);

export default router;
