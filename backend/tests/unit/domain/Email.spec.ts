import { Email } from '../../../src/domain/value-objects/Email';
import { InvalidEmailError } from '../../../src/domain/errors/InvalidEmailError';

describe('Email', () => {
  it('should create a valid email and normalize it to lowercase', () => {
    const email = new Email('User@Example.COM');
    expect(email.toString()).toBe('user@example.com');
  });

  it('should trim whitespace before validating', () => {
    const email = new Email('  user@example.com  ');
    expect(email.toString()).toBe('user@example.com');
  });

  it('should throw InvalidEmailError when email has no @ symbol', () => {
    expect(() => new Email('invalidemail.com')).toThrow(InvalidEmailError);
  });

  it('should throw InvalidEmailError when email has no domain', () => {
    expect(() => new Email('user@')).toThrow(InvalidEmailError);
  });

  it('should throw InvalidEmailError when email is empty', () => {
    expect(() => new Email('')).toThrow(InvalidEmailError);
  });

  it('should return true when comparing two equal emails', () => {
    const first = new Email('user@example.com');
    const second = new Email('USER@EXAMPLE.COM');
    expect(first.equals(second)).toBe(true);
  });

  it('should return false when comparing two different emails', () => {
    const first = new Email('user@example.com');
    const second = new Email('other@example.com');
    expect(first.equals(second)).toBe(false);
  });
});
