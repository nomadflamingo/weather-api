import { subscribe, confirmSubscription, unsubscribe } from '@controllers/subscription.controller';
import * as service from '@services/subscription.service';
import * as mail from '@services/mail.service';
import * as url from '@lib/url';
import { Request, Response } from 'express';

jest.mock('@services/subscription.service');
jest.mock('@services/mail.service');
jest.mock('@lib/url');

const mockRes = () => {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  return { status, json };
};

describe('subscription.controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('subscribe()', () => {
    it('should return 400 for invalid input', async () => {
      const req = { body: { email: '', city: '', frequency: '' } } as Request;
      const res = mockRes();
      await subscribe(req, res as unknown as Response);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 409 if email is already subscribed', async () => {
      const req = {
        body: { email: 'test@example.com', city: 'City', frequency: 'daily' },
      } as Request;
      const res = mockRes();
      (service.findSubscriptionByEmail as jest.Mock).mockResolvedValueOnce({ id: 1 });

      await subscribe(req, res as unknown as Response);
      expect(res.status).toHaveBeenCalledWith(409);
    });

    it('should create subscription and send confirmation email', async () => {
      const req = {
        body: { email: 'test@example.com', city: 'City', frequency: 'daily' },
      } as Request;
      const res = mockRes();

      (service.findSubscriptionByEmail as jest.Mock).mockResolvedValue(null);
      (service.createSubscription as jest.Mock).mockResolvedValue('test-token');
      (url.buildConfirmUrl as jest.Mock).mockReturnValue('http://localhost/confirm/test-token');
      (mail.sendConfirmationEmail as jest.Mock).mockResolvedValue(undefined);

      await subscribe(req, res as unknown as Response);
      expect(service.createSubscription).toHaveBeenCalled();
      expect(mail.sendConfirmationEmail).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should rollback and return 500 if email fails', async () => {
      const req = {
        body: { email: 'test@example.com', city: 'City', frequency: 'hourly' },
      } as Request;
      const res = mockRes();

      (service.findSubscriptionByEmail as jest.Mock).mockResolvedValue(null);
      (service.createSubscription as jest.Mock).mockResolvedValue('bad-token');
      (url.buildConfirmUrl as jest.Mock).mockReturnValue('http://localhost/confirm/bad-token');
      (mail.sendConfirmationEmail as jest.Mock).mockRejectedValue(new Error('SMTP fail'));

      await subscribe(req, res as unknown as Response);
      expect(service.deleteSubscriptionByToken).toHaveBeenCalledWith('bad-token');
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('confirmSubscription()', () => {
    it('should return 400 if token is missing', async () => {
      const req = { params: {} } as unknown as Request;
      const res = mockRes();
      await confirmSubscription(req, res as unknown as Response);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if subscription not found', async () => {
      const req = { params: { token: 'bad-token' } }  as unknown as Request;
      const res = mockRes();

      (service.findSubscriptionByToken as jest.Mock).mockResolvedValue(null);

      await confirmSubscription(req, res as unknown as Response);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should confirm subscription and send unsubscribe email', async () => {
      const req = { params: { token: 'good-token' } } as unknown as Request;
      const res = mockRes();

      (service.findSubscriptionByToken as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
      });
      (url.buildUnsubscribeUrl as jest.Mock).mockReturnValue('http://localhost/unsub/token');
      (mail.sendSubscriptionConfirmedEmail as jest.Mock).mockResolvedValue(undefined);

      await confirmSubscription(req, res as unknown as Response);
      expect(service.confirmSubscriptionByToken).toHaveBeenCalledWith('good-token');
      expect(mail.sendSubscriptionConfirmedEmail).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('unsubscribe()', () => {
    it('should return 400 if token is missing', async () => {
      const req = { params: {} } as Request;
      const res = mockRes();
      await unsubscribe(req, res as unknown as Response);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if subscription not found', async () => {
      const req = { params: { token: 'missing' } } as unknown as Request;
      const res = mockRes();
      (service.findSubscriptionByToken as jest.Mock).mockResolvedValue(null);

      await unsubscribe(req, res as unknown as Response);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should delete subscription and return success', async () => {
      const req = { params: { token: 'good-token' } } as unknown as Request;
      const res = mockRes();

      (service.findSubscriptionByToken as jest.Mock).mockResolvedValue({ id: 1 });

      await unsubscribe(req, res as unknown as Response);
      expect(service.deleteSubscriptionByToken).toHaveBeenCalledWith('good-token');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
