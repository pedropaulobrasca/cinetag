import { InvalidCredentialsError } from '../../../domain/errors/InvalidCredentialsError';
import { Email } from '../../../domain/value-objects/Email';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../services/IPasswordHasher';
import { ITokenService } from '../../services/ITokenService';
import { LoginUserInput, LoginUserOutput } from '../../dtos/AuthDtos';

export class LoginUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const email = new Email(input.email);

    const user = await this.userRepository.findByEmail(email.toString());
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const token = this.tokenService.sign({ userId: user.id });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email.toString(),
      },
    };
  }
}
