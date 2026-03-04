import { Schema, model, Document } from 'mongoose';

interface IActorSubdocument {
  name: string;
  character: string;
}

export interface IFavoriteDocument extends Document {
  _id: string;
  userId: string;
  tmdbId: number;
  title: string;
  rating: number;
  posterPath: string;
  overview: string;
  releaseDate: string;
  genres: string[];
  runtime: number;
  actors: IActorSubdocument[];
  tags: string[];
  addedAt: Date;
}

const actorSchema = new Schema<IActorSubdocument>(
  {
    name: { type: String, required: true },
    character: { type: String, required: true },
  },
  { _id: false },
);

const favoriteSchema = new Schema<IFavoriteDocument>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    tmdbId: { type: Number, required: true },
    title: { type: String, required: true },
    rating: { type: Number, required: true },
    posterPath: { type: String, default: '' },
    overview: { type: String, default: '' },
    releaseDate: { type: String, default: '' },
    genres: { type: [String], default: [] },
    runtime: { type: Number, default: 0 },
    actors: { type: [actorSchema], default: [] },
    tags: { type: [String], default: [] },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

favoriteSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

export const FavoriteModel = model<IFavoriteDocument>('Favorite', favoriteSchema);
