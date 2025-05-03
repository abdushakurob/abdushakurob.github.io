import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/qrmatrix';

if (!process.env.MONGO_URI) {
  console.warn('No MONGO_URI found in environment variables. Using localhost as fallback.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('✅ Successfully connected to MongoDB.');
        return mongoose;
      }).catch((error) => {
        console.error('❌ Error connecting to MongoDB:', error.message);
        throw error;
      });
    } catch (error) {
      console.error('❌ Error initializing MongoDB connection:', error);
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;