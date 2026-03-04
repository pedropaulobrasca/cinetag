import { LoginUser } from '../../../src/application/use-cases/auth/LoginUser';
import { InvalidCredentialsError } from '../../../src/domain/errors/InvalidCredentialsError';
import { User } from '../../../src/domain/entities/User';
import { MockUserRepository } from '../../helpers/MockUserRepository';
import { IPasswordHasher } from '../../../src/application/services/IPasswordHasher';
import { ITokenService } from '../../../src/application/services/ITokenService';

const mockPasswordHasher: IPasswordHasher = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const mockTokenService: ITokenService = {
  sign: jest.fn().mockReturnValue('jwt.token.here'),
  verify: jest.fn(),
};

describe('LoginUser', () => {
  let userRepository: MockUserRepository;
  let loginUser: LoginUser;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    loginUser = new LoginUser(userRepository, mockPasswordHasher, mockTokenService);
    jest.clearAllMocks();
  });

  it('should return a token and user data on valid credentials', async () => {
    const user = User.restore(
      'user-id-1',
      'John Doe',
      'john@example.com',
      'hashed_password',
      new Date(),
    );
    await userRepository.save(user);
    (mockPasswordHasher.compare as jest.Mock).mockResolvedValue(true);

    const output = await loginUser.execute({
      email: 'john@example.com',
      password: 'secret123',
    });

    expect(output.token).toBe('jwt.token.here');
    expect(output.user.email).toBe('john@example.com');
  });

  it('should throw InvalidCredentialsError when email does not exist', async () => {
    await expect(
      loginUser.execute({ email: 'ghost@example.com', password: 'any' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('should throw InvalidCredentialsError when password is wrong', async () => {
    const user = User.restore(
      'user-id-1',
      'John Doe',
      'john@example.com',
      'hashed_password',
      new Date(),
    );
    await userRepository.save(user);
    (mockPasswordHasher.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      loginUser.execute({ email: 'john@example.com', password: 'wrong' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
