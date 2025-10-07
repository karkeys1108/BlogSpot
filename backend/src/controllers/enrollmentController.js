import { validationResult } from 'express-validator';
import { enrollInCourse, listEnrollmentsForUser, updateProgress } from '../services/enrollmentService.js';

export const enroll = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId } = req.body;
    const enrollment = await enrollInCourse({ userId: req.user.id, courseId });
    res.status(201).json({ message: 'Enrolled successfully', data: enrollment });
  } catch (error) {
    next(error);
  }
};

export const myEnrollments = async (req, res, next) => {
  try {
    const enrollments = await listEnrollmentsForUser(req.user.id);
    res.json({ data: enrollments });
  } catch (error) {
    next(error);
  }
};

export const setProgress = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { progress, status } = req.body;
    const enrollment = await updateProgress({
      enrollmentId: req.params.id,
      progress,
      status
    });
    res.json({ message: 'Progress updated', data: enrollment });
  } catch (error) {
    next(error);
  }
};
