import { TmdbId } from '../value-objects/TmdbId';

export interface Actor {
  name: string;
  character: string;
}

interface CreateFavoriteParams {
  id: string;
  userId: string;
  tmdbId: number;
  title: string;
  rating: number;
  posterPath: string;
  overview: string;
  releaseDate: string;
  genres: string[];
  runtime: number;
  actors: Actor[];
  tags: string[];
}

export class Favorite {
  readonly id: string;
  readonly userId: string;
  readonly tmdbId: TmdbId;
  readonly title: string;
  readonly rating: number;
  readonly posterPath: string;
  readonly overview: string;
  readonly releaseDate: string;
  readonly genres: string[];
  readonly runtime: number;
  readonly actors: Actor[];
  readonly tags: string[];
  readonly addedAt: Date;

  private constructor(
    id: string,
    userId: string,
    tmdbId: TmdbId,
    title: string,
    rating: number,
    posterPath: string,
    overview: string,
    releaseDate: string,
    genres: string[],
    runtime: number,
    actors: Actor[],
    tags: string[],
    addedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.tmdbId = tmdbId;
    this.title = title;
    this.rating = rating;
    this.posterPath = posterPath;
    this.overview = overview;
    this.releaseDate = releaseDate;
    this.genres = genres;
    this.runtime = runtime;
    this.actors = actors;
    this.tags = tags;
    this.addedAt = addedAt;
  }

  static create(params: CreateFavoriteParams): Favorite {
    return new Favorite(
      params.id,
      params.userId,
      new TmdbId(params.tmdbId),
      params.title,
      params.rating,
      params.posterPath,
      params.overview,
      params.releaseDate,
      params.genres,
      params.runtime,
      params.actors,
      params.tags,
      new Date(),
    );
  }

  static restore(
    id: string,
    userId: string,
    tmdbId: number,
    title: string,
    rating: number,
    posterPath: string,
    overview: string,
    releaseDate: string,
    genres: string[],
    runtime: number,
    actors: Actor[],
    tags: string[],
    addedAt: Date,
  ): Favorite {
    return new Favorite(
      id,
      userId,
      new TmdbId(tmdbId),
      title,
      rating,
      posterPath,
      overview,
      releaseDate,
      genres,
      runtime,
      actors,
      tags,
      addedAt,
    );
  }

  withUpdatedTags(newTags: string[]): Favorite {
    return new Favorite(
      this.id,
      this.userId,
      this.tmdbId,
      this.title,
      this.rating,
      this.posterPath,
      this.overview,
      this.releaseDate,
      this.genres,
      this.runtime,
      this.actors,
      newTags,
      this.addedAt,
    );
  }
}
