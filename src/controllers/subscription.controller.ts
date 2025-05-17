// src/controllers/subscription.controller.ts
import { Request, Response } from 'express';
import {
  findSubscriptionByEmail,
  createSubscription,
  findSubscriptionByToken,
  confirmSubscriptionByToken,
  deleteSubscriptionByToken,
} from '@services/subscription.service';
import { buildConfirmUrl, buildUnsubscribeUrl } from '@lib/url';
import { sendConfirmationEmail, sendSubscriptionConfirmedEmail } from '@services/mail.service';

export const subscribe = async (req: Request, res: Response) => {
  const { email, city, frequency } = req.body;

  // Validate input
  if (!email || !city || !frequency) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Check if the email is already subscribed
  const existing = await findSubscriptionByEmail(email);

  if (existing) {
    return res.status(409).json({ error: 'Email already subscribed' });
  }

  // Generate token
  const token = await createSubscription(email, city, frequency);

  // Send confirmation email
  const confirmUrl = buildConfirmUrl(token);
  await sendConfirmationEmail(email, confirmUrl);

  return res.status(200).json({ message: 'Subscription created. Confirmation email sent.' });
};

export const confirmSubscription = async (req: Request, res: Response) => {
  const { token } = req.params;

  // Validate token
  if (!token) {
    return res.status(400).json({ error: 'Invalid token' });
  }

  // Find subscription by token
  const subscription = await findSubscriptionByToken(token);

  if (!subscription) {
    return res.status(404).json({ error: 'Token not found' });
  }

  // Confirm subscription
  await confirmSubscriptionByToken(token);

  // Send an unsubscribe email to the user
  const unsubscribeUrl = buildUnsubscribeUrl(token);
  await sendSubscriptionConfirmedEmail(subscription.email, unsubscribeUrl);

  return res.status(200).json({ message: 'Subscription confirmed successfully' });
};

export const unsubscribe = async (req: Request, res: Response) => {
  const { token } = req.params;

  // Validate token
  if (!token) {
    return res.status(400).json({ error: 'Invalid token' });
  }

  // Find subscription by token
  const subscription = await findSubscriptionByToken(token);

  if (!subscription) {
    return res.status(404).json({ error: 'Token not found' });
  }

  // Delete subscription
  await deleteSubscriptionByToken(token);

  return res.status(200).json({ message: 'Unsubscribed successfully' });
};
