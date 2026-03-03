import { User } from '../../../src/domain/entities/User';
import { InvalidEmailError } from '../../../src/domain/errors/InvalidEmailError';

describe('User', () => {
  const validParams = {
    id: 'user-id-1',
    name: 'John Doe',
    email: 'john@example.com',
    passwordHash: 'hashed_password',
  };

  it('should create a User with correct fields', () => {
    const user = User.create(validParams);

    expect(user.id).toBe('user-id-1');
    expect(user.name).toBe('John Doe');
    expect(user.email.toString()).toBe('john@example.com');
    expect(user.passwordHash).toBe('hashed_password');
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should throw InvalidEmailError when email is invalid', () => {
    expect(() => User.create({ ...validParams, email: 'invalid-email' })).toThrow(
      InvalidEmailError,
    );
  });

  it('should restore a User from persistence without changing its createdAt', () => {
    const existingDate = new Date('2024-01-01');
    const user = User.restore(
      'user-id-1',
      'John Doe',
      'john@example.com',
      'hashed_password',
      existingDate,
    );

    expect(user.createdAt).toBe(existingDate);
  });
});
