import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

async function bootstrap() {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.info(`🚀 BladeMart API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.info(`\n${signal} received — shutting down gracefully...`);
    server.close(() => {
      console.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
