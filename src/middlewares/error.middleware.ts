import { Request, Response, NextFunction } from 'express';
import { ExternalApiError } from '@lib/errors/external-api-error';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.error('Global error handler:', err);

  if (err instanceof ExternalApiError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Unexpected error occurred' });
  return;
};
