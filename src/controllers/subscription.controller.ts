// src/controllers/subscription.controller.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export const subscribe = async (req: Request, res: Response) => {
  const { email, city, frequency } = req.body;

  if (!email || !city || !frequency) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const existing = await prisma.subscription.findUnique({ where: { email } });

    if (existing) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }

    const token = uuidv4();

    await prisma.subscription.create({
      data: {
        email,
        city,
        frequency,
        confirmed: false,
        token,
      },
    });

    // TODO: Send confirmation email with token
    return res.status(200).json({ message: 'Subscription created. Confirmation email sent.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create subscription' });
  }
};

export const confirmSubscription = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const subscription = await prisma.subscription.findUnique({ where: { token } });

    if (!subscription) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    await prisma.subscription.update({
      where: { token },
      data: { confirmed: true },
    });

    return res.status(200).json({ message: 'Subscription confirmed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to confirm subscription' });
  }
};

export const unsubscribe = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const subscription = await prisma.subscription.findUnique({ where: { token } });

    if (!subscription) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    await prisma.subscription.delete({ where: { token } });

    return res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to unsubscribe' });
  }
};
