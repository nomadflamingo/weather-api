// src/controllers/subscription.controller.ts
import { Request, Response } from 'express';
import {
  findSubscriptionByEmail,
  createSubscription,
  findSubscriptionByToken,
  confirmSubscriptionByToken,
  deleteSubscriptionByToken,
} from '@services/subscription.service';

export const subscribe = async (req: Request, res: Response) => {
  const { email, city, frequency } = req.body;

  if (!email || !city || !frequency) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const existing = await findSubscriptionByEmail(email);

  if (existing) {
    return res.status(409).json({ error: 'Email already subscribed' });
  }

  const token = await createSubscription(email, city, frequency);

  // TODO: Send confirmation email with token
  return res.status(200).json({ message: 'Subscription created. Confirmation email sent.' });
};

export const confirmSubscription = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  const subscription = await findSubscriptionByToken(token);

  if (!subscription) {
    return res.status(404).json({ error: 'Invalid or expired token' });
  }

  await confirmSubscriptionByToken(token);

  return res.status(200).json({ message: 'Subscription confirmed' });
};

export const unsubscribe = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  const subscription = await findSubscriptionByToken(token);

  if (!subscription) {
    return res.status(404).json({ error: 'Invalid or expired token' });
  }

  await deleteSubscriptionByToken(token);

  return res.status(200).json({ message: 'Unsubscribed successfully' });
};
