import { BcryptPasswordHasher } from '../../../src/infrastructure/services/BcryptPasswordHasher';

describe('BcryptPasswordHasher', () => {
  const hasher = new BcryptPasswordHasher();

  it('should produce a different string than the original password', async () => {
    const hash = await hasher.hash('my_secret_password');
    expect(hash).not.toBe('my_secret_password');
  });

  it('should produce a unique hash on each call for the same password', async () => {
    const firstHash = await hasher.hash('same_password');
    const secondHash = await hasher.hash('same_password');
    expect(firstHash).not.toBe(secondHash);
  });

  it('should return true when comparing a password with its correct hash', async () => {
    const hash = await hasher.hash('correct_password');
    const result = await hasher.compare('correct_password', hash);
    expect(result).toBe(true);
  });

  it('should return false when comparing a password with a wrong hash', async () => {
    const hash = await hasher.hash('correct_password');
    const result = await hasher.compare('wrong_password', hash);
    expect(result).toBe(false);
  });
});
