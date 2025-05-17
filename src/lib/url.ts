/**
 * Builds a full confirmation URL given host and token.
 */
export const buildConfirmUrl = (token: string): string => {
  return `${getBaseUrl()}/api/confirm/${token}`;
};

/**
 * Builds a full unsubscribe URL given host and token.
 */
export const buildUnsubscribeUrl = (token: string): string => {
  return `${getBaseUrl()}/api/unsubscribe/${token}`;
};

const getBaseUrl = () => {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) throw new Error('BASE_URL is not defined');
  return baseUrl;
};