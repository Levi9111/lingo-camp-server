import mongoose from 'mongoose';
import 'dotenv/config';

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.faioyfi.mongodb.net/lingoCamp?retryWrites=true&w=majority`;

export const connectDB = async (): Promise<void> => {
  mongoose.connection.on('connected', () =>
    console.log('✅ MongoDB connected — lingoCamp ready')
  );
  mongoose.connection.on('error', (err) =>
    console.error('❌ MongoDB error:', err)
  );
  mongoose.connection.on('disconnected', () =>
    console.warn('⚠️  MongoDB disconnected')
  );

  await mongoose.connect(uri, {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
  });
};

export const closeDB = async (): Promise<void> => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed');
};