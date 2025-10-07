import {
  createClassroom,
  listClassroomsForUser,
  joinClassroomByCode,
  getClassroomDetail,
  addRecommendation as addRecommendationService,
  removeRecommendation as removeRecommendationService
} from '../services/classroomService.js';

export const create = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Classroom name is required' });
    }

    const classroom = await createClassroom({
      ownerId: req.user.id || req.user._id,
      name,
      description
    });

    return res.status(201).json({ data: classroom });
  } catch (error) {
    return next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const classrooms = await listClassroomsForUser({ userId, role: req.user.role });
    return res.json({ data: classrooms });
  } catch (error) {
    return next(error);
  }
};

export const join = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Classroom code is required' });
    }

    const classroom = await joinClassroomByCode({
      userId: req.user.id || req.user._id,
      code
    });

    return res.json({ data: classroom });
  } catch (error) {
    return next(error);
  }
};

export const detail = async (req, res, next) => {
  try {
    const classroom = await getClassroomDetail({
      classroomId: req.params.id,
      requesterId: req.user.id || req.user._id
    });

    return res.json({ data: classroom });
  } catch (error) {
    return next(error);
  }
};

export const addRecommendation = async (req, res, next) => {
  try {
    const { title, url, notes } = req.body;
    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required' });
    }

    const classroom = await addRecommendationService({
      classroomId: req.params.id,
      requesterId: req.user.id || req.user._id,
      title,
      url,
      notes
    });

    return res.json({ data: classroom });
  } catch (error) {
    return next(error);
  }
};

export const removeRecommendation = async (req, res, next) => {
  try {
    const classroom = await removeRecommendationService({
      classroomId: req.params.id,
      requesterId: req.user.id || req.user._id,
      recommendationId: req.params.recommendationId
    });

    return res.json({ data: classroom });
  } catch (error) {
    return next(error);
  }
};
