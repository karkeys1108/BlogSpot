import { Certificate, Enrollment } from '../models/index.js';

export const uploadCertificate = async ({ enrollmentId, file, title }) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw Object.assign(new Error('Enrollment not found'), { status: 404 });
  }

  if (!file) {
    throw Object.assign(new Error('Certificate file missing'), { status: 400 });
  }

  let fileUrl = file.path;
  const publicId = file.filename || file.public_id || null;

  if (file.destination && file.filename) {
    fileUrl = `/uploads/${file.filename}`;
  }

  const certificate = await Certificate.findOneAndUpdate(
    { enrollment: enrollmentId },
    {
      $set: {
        title: title || file.originalname,
        url: fileUrl,
        publicId,
        issuedOn: new Date()
      },
      $setOnInsert: { enrollment: enrollmentId }
    },
    { new: true, upsert: true }
  );

  return certificate.toJSON();
};

export const listCertificatesForUser = async (userId) => {
  const enrollmentIds = await Enrollment.find({ user: userId }).distinct('_id');

  if (!enrollmentIds.length) {
    return [];
  }

  const certificates = await Certificate.find({ enrollment: { $in: enrollmentIds } })
    .populate({
      path: 'enrollment',
      populate: { path: 'course' }
    })
    .lean({ virtuals: true });

  return certificates.filter((certificate) => certificate.enrollment);
};
