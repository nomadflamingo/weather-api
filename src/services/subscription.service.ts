import prisma from '@lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { Subscription, Frequency } from '@prisma/client';

export const findSubscriptionByEmail = async (email: string): Promise<Subscription | null> => {
  return prisma.subscription.findUnique({ where: { email } });
};

export const createSubscription = async (email: string, city: string, frequency: Frequency): Promise<string> => {
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

  return token;
};

export const findSubscriptionByToken = async (token: string): Promise<Subscription | null> => {
  return prisma.subscription.findUnique({ where: { token } });
};

export const confirmSubscriptionByToken = async (token: string): Promise<void> => {
  await prisma.subscription.update({
    where: { token },
    data: { confirmed: true },
  });
};

export const deleteSubscriptionByToken = async (token: string): Promise<void> => {
  await prisma.subscription.delete({ where: { token } });
};

export const getAllConfirmedSubscriptions = async () => {
  return prisma.subscription.findMany({
    where: { confirmed: true },
  });
};