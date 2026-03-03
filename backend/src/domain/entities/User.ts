import { Email } from '../value-objects/Email';

interface CreateUserParams {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export class User {
  readonly id: string;
  readonly name: string;
  readonly email: Email;
  readonly passwordHash: string;
  readonly createdAt: Date;

  private constructor(
    id: string,
    name: string,
    email: Email,
    passwordHash: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }

  static create(params: CreateUserParams): User {
    return new User(
      params.id,
      params.name,
      new Email(params.email),
      params.passwordHash,
      new Date(),
    );
  }

  static restore(
    id: string,
    name: string,
    email: string,
    passwordHash: string,
    createdAt: Date,
  ): User {
    return new User(id, name, new Email(email), passwordHash, createdAt);
  }
}
