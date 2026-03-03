import { randomUUID } from 'crypto';
import { User } from '../../../domain/entities/User';
import { EmailAlreadyInUseError } from '../../../domain/errors/EmailAlreadyInUseError';
import { Email } from '../../../domain/value-objects/Email';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../services/IPasswordHasher';
import { RegisterUserInput, RegisterUserOutput } from '../../dtos/AuthDtos';

export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const email = new Email(input.email);

    const existingUser = await this.userRepository.findByEmail(email.toString());
    if (existingUser) {
      throw new EmailAlreadyInUseError(email.toString());
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = User.create({
      id: randomUUID(),
      name: input.name,
      email: email.toString(),
      passwordHash,
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email.toString(),
    };
  }
}
