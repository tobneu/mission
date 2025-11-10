import crypto from 'crypto';
import { questions } from './questions';

export function generateTaskCode(taskId: number, secret = process.env.BIRTHDAY_SECRET || ''): string {
  if (!secret) throw new Error('BIRTHDAY_SECRET is required');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(String(taskId));
  const hex = hmac.digest('hex');
  const chunk = hex.slice(0, 12); // 48 bits
  const asBigInt = BigInt('0x' + chunk);
  const base36 = asBigInt.toString(36).toUpperCase();
  return base36.padStart(5, '0').slice(0, 5);
}

export function taskIdFromCode(code: string, totalTasks = questions.length): number | null {
  const uppercase = code.toUpperCase();
  for (let id = 1; id <= totalTasks; id++) {
    try {
      if (generateTaskCode(id) === uppercase) return id;
    } catch (e) {
      // If secret missing, break early
      break;
    }
  }
  return null;
}

export default generateTaskCode;
import { createHash } from 'crypto';

export function generateToken(name: string, secret: string): string {
  const hash = createHash('sha256');
  hash.update(name + secret);
  return hash.digest('hex').substring(0, 10);
}
