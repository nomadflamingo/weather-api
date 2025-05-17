/**
 * Builds a full confirmation URL given host and token.
 */
export const buildConfirmUrl = (host: string, protocol: string, token: string): string => {
  return `${protocol}://${host}/api/confirm/${token}`;
};

/**
 * Builds a full unsubscribe URL given host and token.
 */
export const buildUnsubscribeUrl = (host: string, protocol: string, token: string): string => {
  return `${protocol}://${host}/api/unsubscribe/${token}`;
};