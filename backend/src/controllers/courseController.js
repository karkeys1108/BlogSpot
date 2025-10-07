import { listCourses, getCourseById, compareCourses } from '../services/courseService.js';
import { getAllAvailableCourses } from '../services/scrapingService.js';

export const getCourses = async (req, res, next) => {
  try {
    let courses;
    if (req.query.platform === 'external') {
      courses = await getAllAvailableCourses(req.query);
    } else {
      courses = await listCourses(req.query);
    }
    res.json({ data: courses });
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.id);
    res.json({ data: course });
  } catch (error) {
    next(error);
  }
};

export const compare = async (req, res, next) => {
  try {
    const ids = req.query.ids ? req.query.ids.split(',') : [];
    let courses;
    
    if (req.query.platform === 'external') {
      const allCourses = await getAllAvailableCourses();
      courses = allCourses.filter(course => ids.includes(course.id));
    } else {
      courses = await compareCourses({ ...req.query, ids });
    }
    
    res.json({ data: courses });
  } catch (error) {
    next(error);
  }
};
