import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  const passwordHash = await bcrypt.hash(password, 10);

  return { passwordHash };
}

export async function comparePassword(password: string, hashed_password: string) {
  return bcrypt.compare(password, hashed_password);
}
