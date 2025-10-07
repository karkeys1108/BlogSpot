import fs from 'fs/promises';
import path from 'path';
import { Types } from 'mongoose';
import { Course } from '../models/index.js';

const COURSES_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'courses.json');

export const ensureCoursesSeeded = async () => {
  const count = await Course.estimatedDocumentCount();
  if (count > 0) return;

  const raw = await fs.readFile(COURSES_JSON_PATH, 'utf-8');
  const courses = JSON.parse(raw);
  await Course.insertMany(courses);
};

export const listCourses = async ({ search, provider, category }) => {
  const filter = {};
  if (provider) {
    filter.provider = provider;
  }
  if (category) {
    filter.category = category;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  return Course.find(filter).sort({ title: 1 }).lean({ virtuals: true });
};

export const getCourseById = async (id) => {
  const course = await Course.findById(id).lean({ virtuals: true });
  if (!course) {
    throw Object.assign(new Error('Course not found'), { status: 404 });
  }
  return course;
};

export const compareCourses = async ({ ids = [], provider, category, title }) => {
  const filter = {};
  const idList = ids
    .filter(Boolean)
    .filter((value) => Types.ObjectId.isValid(value))
    .map((value) => new Types.ObjectId(value));
  if (idList.length) {
    filter._id = { $in: idList };
  }
  if (provider) {
    filter.provider = provider;
  }
  if (category) {
    filter.category = category;
  }
  if (title) {
    filter.title = { $regex: title, $options: 'i' };
  }
  const courses = await Course.find(filter).lean({ virtuals: true });
  return courses;
};
