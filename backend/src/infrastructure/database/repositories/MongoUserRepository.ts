import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserModel } from '../models/UserModel';

export class MongoUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const document = await UserModel.findById(id).lean().exec();
    if (!document) return null;

    return User.restore(
      document._id as string,
      document.name,
      document.email,
      document.passwordHash,
      document.createdAt,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const document = await UserModel.findOne({ email }).lean().exec();
    if (!document) return null;

    return User.restore(
      document._id as string,
      document.name,
      document.email,
      document.passwordHash,
      document.createdAt,
    );
  }

  async save(user: User): Promise<void> {
    await UserModel.create({
      _id: user.id,
      name: user.name,
      email: user.email.toString(),
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    });
  }
}
