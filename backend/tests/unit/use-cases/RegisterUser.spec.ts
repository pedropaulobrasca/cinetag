import { RegisterUser } from '../../../src/application/use-cases/auth/RegisterUser';
import { EmailAlreadyInUseError } from '../../../src/domain/errors/EmailAlreadyInUseError';
import { InvalidEmailError } from '../../../src/domain/errors/InvalidEmailError';
import { MockUserRepository } from '../../helpers/MockUserRepository';
import { IPasswordHasher } from '../../../src/application/services/IPasswordHasher';

const mockPasswordHasher: IPasswordHasher = {
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
};

describe('RegisterUser', () => {
  let userRepository: MockUserRepository;
  let registerUser: RegisterUser;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    registerUser = new RegisterUser(userRepository, mockPasswordHasher);
    jest.clearAllMocks();
  });

  it('should register a new user and return their data without the password', async () => {
    const output = await registerUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secret123',
    });

    expect(output.name).toBe('John Doe');
    expect(output.email).toBe('john@example.com');
    expect(output.id).toBeDefined();
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith('secret123');
  });

  it('should throw EmailAlreadyInUseError when registering a duplicate email', async () => {
    await registerUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secret123',
    });

    await expect(
      registerUser.execute({
        name: 'Another John',
        email: 'john@example.com',
        password: 'other123',
      }),
    ).rejects.toThrow(EmailAlreadyInUseError);
  });

  it('should throw InvalidEmailError when email format is invalid', async () => {
    await expect(
      registerUser.execute({
        name: 'John Doe',
        email: 'not-an-email',
        password: 'secret123',
      }),
    ).rejects.toThrow(InvalidEmailError);
  });
});
