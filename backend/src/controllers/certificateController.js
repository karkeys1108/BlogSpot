import { uploadCertificate, listCertificatesForUser } from '../services/certificateService.js';

export const uploadCertificateController = async (req, res, next) => {
  try {
    const { title } = req.body;
    const certificate = await uploadCertificate({
      enrollmentId: req.params.enrollmentId,
      file: req.file,
      title
    });
    res.status(201).json({ message: 'Certificate uploaded', data: certificate });
  } catch (error) {
    next(error);
  }
};

export const myCertificates = async (req, res, next) => {
  try {
    const certificates = await listCertificatesForUser(req.user.id);
    res.json({ data: certificates });
  } catch (error) {
    next(error);
  }
};
