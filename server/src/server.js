import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
const requiredEnv = ['PORT', 'MONGO_URI', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error('❌ Missing environment variables:', missingEnv.join(', '));
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🔄 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('🔄 SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Server Start Error:', error.message);
    process.exit(1);
  }
};

startServer();