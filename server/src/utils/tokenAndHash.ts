import crypto from 'crypto';

export const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const createTokens = ({
  timeoutMinute,
}: { timeoutMinute?: number } = {}) => {
  const token = crypto.randomBytes(6).toString('hex');

  let hash = hashToken(token);
  if (timeoutMinute) hash = `${hash}/${Date.now() + timeoutMinute * 60 * 1000}`;

  return { token, hash };
};
