import { Schema, model } from 'mongoose';

export interface IUserDocument {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: false,
  },
);

export const UserModel = model<IUserDocument>('User', userSchema);
