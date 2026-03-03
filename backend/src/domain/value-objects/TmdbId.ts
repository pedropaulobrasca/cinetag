import { InvalidTmdbIdError } from '../errors/InvalidTmdbIdError';

export class TmdbId {
  private readonly value: number;

  constructor(rawId: unknown) {
    const parsed = Number(rawId);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new InvalidTmdbIdError(rawId);
    }

    this.value = parsed;
  }

  toNumber(): number {
    return this.value;
  }

  toString(): string {
    return String(this.value);
  }

  equals(other: TmdbId): boolean {
    return this.value === other.value;
  }
}
