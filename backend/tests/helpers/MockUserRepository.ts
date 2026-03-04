import { User } from '../../src/domain/entities/User';
import { IUserRepository } from '../../src/domain/repositories/IUserRepository';

export class MockUserRepository implements IUserRepository {
  private store = new Map<string, User>();

  async findById(id: string): Promise<User | null> {
    return this.store.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.store.values()) {
      if (user.email.toString() === email) {
        return user;
      }
    }
    return null;
  }

  async save(user: User): Promise<void> {
    this.store.set(user.id, user);
  }

  clear(): void {
    this.store.clear();
  }
}
