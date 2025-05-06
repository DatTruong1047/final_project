import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<{ passwordHash: string }> {
  const passwordHash = await bcrypt.hash(password, 10);

  return { passwordHash };
}

export async function comparePassword(password: string, hashed_password: string): Promise<boolean> {
  return bcrypt.compare(password, hashed_password);
}

export function encodeBase64(payload: string): string {
  return Buffer.from(payload).toString('base64url');
}

export function decodeBase64(token: string): string {
  return Buffer.from(token, 'base64url').toString();
}
