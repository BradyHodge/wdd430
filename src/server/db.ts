import mongoose from 'mongoose';

export async function connectMongo(): Promise<void> {
  const uri = process.env['MONGODB_URI'] ?? 'mongodb://127.0.0.1:27017/wdd430';
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(uri);
}
