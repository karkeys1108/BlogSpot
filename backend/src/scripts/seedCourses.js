import { connectDatabase, mongoose } from '../models/index.js';
import { ensureCoursesSeeded } from '../services/courseService.js';

const seed = async () => {
  try {
    await connectDatabase();
    await ensureCoursesSeeded();
    console.log('Courses seeded successfully');
  } catch (error) {
    console.error('Failed to seed courses', error);
  } finally {
    await mongoose.connection.close();
  }
};

seed();
