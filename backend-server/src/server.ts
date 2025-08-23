import { env } from './config/env';
import { prisma } from './db/prisma';
import app from './app';

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start the server
    const server = app.listen(env.port, () => {
      console.log(`🚀 MDM Backend Server running on port ${env.port}`);
      console.log(`📱 Environment: ${env.nodeEnv}`);
      console.log(`🔗 Health check: ${env.serverUrl}/api/health`);
      console.log(`📚 API docs: ${env.serverUrl}/api-docs`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('HTTP server closed.');
        
        try {
          await prisma.$disconnect();
          console.log('Database connection closed.');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
