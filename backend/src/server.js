import env from './config/env.js';
import app from './app.js';
import { connectDatabase } from './models/index.js';
import { ensureCoursesSeeded } from './services/courseService.js';

const startServer = async () => {
  try {
    await connectDatabase();
    await ensureCoursesSeeded();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
