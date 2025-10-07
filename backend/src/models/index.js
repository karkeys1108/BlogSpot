import connectDatabase, { mongoose } from '../config/database.js';
import User from './User.js';
import Course from './Course.js';
import Enrollment from './Enrollment.js';
import Certificate from './Certificate.js';
import Classroom from './Classroom.js';

export { connectDatabase, mongoose, User, Course, Enrollment, Certificate, Classroom };
