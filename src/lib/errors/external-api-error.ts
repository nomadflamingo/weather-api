export class ExternalApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ExternalApiError';
  }
}
