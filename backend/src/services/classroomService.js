import crypto from 'crypto';
import { Classroom, Enrollment } from '../models/index.js';

const generateCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = crypto.randomBytes(3).toString('hex').toUpperCase();
    exists = await Classroom.exists({ code });
  }
  return code;
};

const sanitizeUserSummary = (user) => {
  if (!user) return undefined;
  if (typeof user === 'string') {
    return {
      id: user,
      name: undefined,
      email: undefined,
      role: undefined
    };
  }

  return {
    id: user.id || user._id?.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };
};

const sanitizeRecommendation = (recommendation) => ({
  id: recommendation._id?.toString() || recommendation.id,
  title: recommendation.title,
  url: recommendation.url,
  notes: recommendation.notes || '',
  createdAt: recommendation.createdAt,
  createdBy: sanitizeUserSummary(recommendation.createdBy)
});

const sanitizeClassroomSummary = (classroom, includeCode = false) => ({
  id: classroom.id,
  name: classroom.name,
  description: classroom.description || '',
  code: includeCode ? classroom.code : undefined,
  owner: sanitizeUserSummary(classroom.owner),
  memberCount: classroom.members?.length || 0,
  recommendationCount: classroom.recommendations?.length || 0,
  createdAt: classroom.createdAt,
  updatedAt: classroom.updatedAt
});

export const createClassroom = async ({ ownerId, name, description }) => {
  const code = await generateCode();
  const classroom = await Classroom.create({
    name,
    description,
    code,
    owner: ownerId,
    members: []
  });

  const populated = await Classroom.findById(classroom._id)
    .populate('owner', 'name email role')
    .populate('members', 'name email role')
    .lean({ virtuals: true });

  return sanitizeClassroomSummary(populated, true);
};

export const listClassroomsForUser = async ({ userId, role }) => {
  const owned = await Classroom.find({ owner: userId })
    .populate('owner', 'name email role')
    .populate('members', 'name email role')
    .lean({ virtuals: true });

  const joined = await Classroom.find({
    members: userId,
    owner: { $ne: userId }
  })
    .populate('owner', 'name email role')
    .populate('members', 'name email role')
    .lean({ virtuals: true });

  const ownedSummaries = owned.map((classroom) => sanitizeClassroomSummary(classroom, role === 'faculty'));
  const joinedSummaries = joined.map((classroom) => sanitizeClassroomSummary(classroom, false));

  return { owned: ownedSummaries, joined: joinedSummaries };
};

export const joinClassroomByCode = async ({ userId, code }) => {
  const normalizedCode = code.trim().toUpperCase();
  const classroom = await Classroom.findOne({ code: normalizedCode });
  if (!classroom) {
    throw Object.assign(new Error('Classroom not found'), { status: 404 });
  }

  const isOwner = classroom.owner.toString() === userId;
  if (isOwner) {
    return sanitizeClassroomSummary(
      await Classroom.findById(classroom._id)
        .populate('owner', 'name email role')
        .populate('members', 'name email role')
        .lean({ virtuals: true }),
      true
    );
  }

  const alreadyMember = classroom.members.some((memberId) => memberId.toString() === userId);
  if (!alreadyMember) {
    classroom.members.push(userId);
    await classroom.save();
  }

  const populated = await Classroom.findById(classroom._id)
    .populate('owner', 'name email role')
    .populate('members', 'name email role')
    .lean({ virtuals: true });

  return sanitizeClassroomSummary(populated, false);
};

export const getClassroomDetail = async ({ classroomId, requesterId }) => {
  const classroom = await Classroom.findById(classroomId)
    .populate('owner', 'name email role')
    .populate('members', 'name email role')
    .populate('recommendations.createdBy', 'name email role')
    .lean({ virtuals: true });

  if (!classroom) {
    throw Object.assign(new Error('Classroom not found'), { status: 404 });
  }

  const isOwner = classroom.owner?.id === requesterId || classroom.owner?._id?.toString() === requesterId;
  const isMember = classroom.members?.some((member) => {
    const id = member.id || member._id?.toString();
    return id === requesterId;
  });

  if (!isOwner && !isMember) {
    throw Object.assign(new Error('Access denied'), { status: 403 });
  }

  const memberIds = classroom.members?.map((member) => member._id?.toString() || member.id) || [];

  const memberDetails = await Promise.all(
    memberIds.map(async (memberId) => {
      const user = classroom.members.find((member) => (member._id?.toString() || member.id) === memberId);
      const enrollments = await Enrollment.find({ user: memberId })
        .populate('course')
        .populate('certificate')
        .lean({ virtuals: true });

      const total = enrollments.length;
      const completed = enrollments.filter((enrollment) => enrollment.status === 'completed').length;
      const inProgress = enrollments.filter((enrollment) => enrollment.status === 'in-progress').length;
      const averageProgress = total
        ? Math.round(enrollments.reduce((sum, enrollment) => sum + (enrollment.progress || 0), 0) / total)
        : 0;

      const certificates = enrollments
        .filter((enrollment) => Boolean(enrollment.certificate))
        .map((enrollment) => ({
          id: enrollment.certificate.id,
          title: enrollment.certificate.title,
          courseTitle: enrollment.course?.title,
          issuedOn: enrollment.certificate.issuedOn,
          url: enrollment.certificate.url
        }));

      return {
        id: user.id || user._id?.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        stats: {
          total,
          completed,
          inProgress,
          averageProgress,
          certificateCount: certificates.length
        },
        certificates
      };
    })
  );

  const recommendations = (classroom.recommendations || []).map((recommendation) => sanitizeRecommendation(recommendation));

  return {
    id: classroom.id,
    name: classroom.name,
    description: classroom.description,
    code: classroom.code,
    owner: sanitizeUserSummary(classroom.owner),
    memberCount: classroom.members?.length || 0,
    members: memberDetails,
    recommendations,
    recommendationCount: recommendations.length,
    createdAt: classroom.createdAt,
    updatedAt: classroom.updatedAt,
    canManage: isOwner
  };
};

export const addRecommendation = async ({ classroomId, requesterId, title, url, notes }) => {
  const classroom = await Classroom.findById(classroomId);

  if (!classroom) {
    throw Object.assign(new Error('Classroom not found'), { status: 404 });
  }

  if (classroom.owner.toString() !== requesterId) {
    throw Object.assign(new Error('Only the classroom owner can recommend certificates'), { status: 403 });
  }

  classroom.recommendations.push({
    title,
    url,
    notes,
    createdBy: requesterId,
    createdAt: new Date()
  });

  await classroom.save();

  return getClassroomDetail({ classroomId, requesterId });
};

export const removeRecommendation = async ({ classroomId, requesterId, recommendationId }) => {
  const classroom = await Classroom.findById(classroomId);

  if (!classroom) {
    throw Object.assign(new Error('Classroom not found'), { status: 404 });
  }

  if (classroom.owner.toString() !== requesterId) {
    throw Object.assign(new Error('Only the classroom owner can manage recommendations'), { status: 403 });
  }

  const initialLength = classroom.recommendations.length;
  classroom.recommendations = classroom.recommendations.filter(
    (recommendation) => recommendation._id?.toString() !== recommendationId && recommendation.id !== recommendationId
  );

  if (classroom.recommendations.length === initialLength) {
    throw Object.assign(new Error('Recommendation not found'), { status: 404 });
  }

  await classroom.save();

  return getClassroomDetail({ classroomId, requesterId });
};

export const listClassroomMembers = async ({ classroomId }) => {
  const classroom = await Classroom.findById(classroomId)
    .populate('members', 'name email role')
    .lean({ virtuals: true });
  if (!classroom) return [];
  return classroom.members || [];
};
