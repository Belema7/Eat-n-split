import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';

const connectDB = async () => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ MongoDB Connected');
      return;
    } catch (error) {
      retries++;
      if (error instanceof MongoServerError) {
        console.error(`❌ MongoDB Error: ${error.message} (Code: ${error.code || 'Unknown'})`);
      } else if (error.message.includes('mongodb+srv URI cannot have port number')) {
        console.error('❌ Invalid MONGO_URI: Remove port number from mongodb+srv URI in .env');
      } else {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
      }
      console.log(`🔄 Retry ${retries}/${maxRetries} in 5 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  console.error('❌ Max retries reached. Exiting...');
  process.exit(1);
};

export default connectDB;