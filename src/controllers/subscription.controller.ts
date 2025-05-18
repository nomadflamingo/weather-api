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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate input
  // TODO: replace with enums for frequency
  // TODO: split validation into a separate function
  if (!email || !city || !frequency || !['hourly', 'daily'].includes(frequency) || !emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }

  // Check if the email is already subscribed
  const existing = await findSubscriptionByEmail(email);
  if (existing) {
    res.status(409).json({ error: 'Email already subscribed' });
    return;
  }

  // Generate token
  const token = await createSubscription(email, city, frequency);

  // Send confirmation email
  try {
    const confirmUrl = buildConfirmUrl(token);
    await sendConfirmationEmail(email, confirmUrl);

  } catch {
    // revert subscription creation if email fails
    await deleteSubscriptionByToken(token);
    res.status(500).json({ error: 'Failed to send confirmation email' });
    return;
  }

  res.status(200).json({ message: 'Subscription created. Confirmation email sent.' });
};

export const confirmSubscription = async (req: Request, res: Response) => {
  const { token } = req.params;

  // Validate token
  if (!token) {
    res.status(400).json({ error: 'Invalid token' });
    return;
  }

  // Find subscription by token
  const subscription = await findSubscriptionByToken(token);

  if (!subscription) {
    res.status(404).json({ error: 'Token not found' });
    return;
  }

  // Confirm subscription
  await confirmSubscriptionByToken(token);

  // Send an unsubscribe email to the user
  const unsubscribeUrl = buildUnsubscribeUrl(token);
  await sendSubscriptionConfirmedEmail(subscription.email, unsubscribeUrl);

  res.status(200).json({ message: 'Subscription confirmed successfully' });
  return;
};

export const unsubscribe = async (req: Request, res: Response) => {
  const { token } = req.params;

  // Validate token
  if (!token) {
    res.status(400).json({ error: 'Invalid token' });
    return;
  }

  // Find subscription by token
  const subscription = await findSubscriptionByToken(token);

  if (!subscription) {
    res.status(404).json({ error: 'Token not found' });
    return;
  }

  // Delete subscription
  await deleteSubscriptionByToken(token);

  res.status(200).json({ message: 'Unsubscribed successfully' });
  return;
};
