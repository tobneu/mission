import { createHash } from 'crypto';

export function generateToken(name: string, secret: string): string {
  const hash = createHash('sha256');
  hash.update(name + secret);
  return hash.digest('hex').substring(0, 10);
}
