import mongoose from 'mongoose';

export async function connectToMongo(uri: string): Promise<void> {
  const maskedUri = uri.replace(/:\/\/[^@]+@/, '://<credentials>@');
  console.log(`[MongoDB] Connecting to ${maskedUri}...`);
  await mongoose.connect(uri);
  console.log('[MongoDB] Connected successfully.');
}

export async function disconnectFromMongo(): Promise<void> {
  await mongoose.disconnect();
  console.log('[MongoDB] Disconnected.');
}
