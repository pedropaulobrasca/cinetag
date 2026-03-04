import bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../application/services/IPasswordHasher';

const SALT_ROUNDS = 10;

export class BcryptPasswordHasher implements IPasswordHasher {
  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, SALT_ROUNDS);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
