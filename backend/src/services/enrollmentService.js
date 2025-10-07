import { Enrollment } from '../models/index.js';

export const enrollInCourse = async ({ userId, courseId }) => {
  let enrollment = await Enrollment.findOne({ user: userId, course: courseId });
  if (!enrollment) {
    enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      status: 'enrolled',
      startedAt: new Date()
    });
  }

  return Enrollment.findById(enrollment._id)
    .populate('course')
    .populate('certificate')
    .lean({ virtuals: true });
};

export const listEnrollmentsForUser = async (userId) => {
  return Enrollment.find({ user: userId })
    .populate('course')
    .populate('certificate')
    .lean({ virtuals: true });
};

export const updateProgress = async ({ enrollmentId, progress, status }) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw Object.assign(new Error('Enrollment not found'), { status: 404 });
  }

  if (typeof progress === 'number') {
    enrollment.progress = progress;
  }
  if (status) {
    enrollment.status = status;
  }

  if (enrollment.progress === 100 && !enrollment.completedAt) {
    enrollment.completedAt = new Date();
    enrollment.status = 'completed';
  }

  await enrollment.save();

  return Enrollment.findById(enrollment._id)
    .populate('course')
    .populate('certificate')
    .lean({ virtuals: true });
};
