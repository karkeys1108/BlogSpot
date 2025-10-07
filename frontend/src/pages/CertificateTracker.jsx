import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { formatDate } from '../utils/formatDate.js';

const CertificateTracker = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enrollmentRes, certificateRes] = await Promise.all([
        api.get('/enrollments/mine'),
        api.get('/certificates/mine')
      ]);
      setEnrollments(enrollmentRes.data.data);
      setCertificates(certificateRes.data.data);
    } catch (error) {
      console.error('Failed to load certificate data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedEnrollment || !file) return;

    const formData = new FormData();
    formData.append('certificate', file);

    setUploading(true);
    try {
      await api.post(`/certificates/${selectedEnrollment}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFile(null);
      setSelectedEnrollment('');
      await fetchData();
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white/90 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Certificates</h1>
        <p className="mt-2 text-sm text-slate-500">Upload and manage your course completion certificates seamlessly.</p>
      </header>

      <section className="rounded-3xl bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Upload certificate</h2>
        <form onSubmit={handleUpload} className="mt-4 grid gap-4 md:grid-cols-[2fr_2fr_auto]">
          <select
            value={selectedEnrollment}
            onChange={(event) => setSelectedEnrollment(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          >
            <option value="">Select enrollment</option>
            {enrollments.map((enrollment) => (
              <option key={enrollment.id} value={enrollment.id}>
                {enrollment.course.title}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
          <button
            type="submit"
            disabled={uploading}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Your certificates</h2>
        {loading && <p className="text-sm text-slate-500">Loading certificates…</p>}
        {!loading && certificates.length === 0 && <p className="text-sm text-slate-500">No certificates uploaded yet.</p>}
        {certificates.map((certificate) => (
          <div key={certificate.id} className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-wider text-primary">{certificate.enrollment.course.provider}</p>
                <h3 className="text-lg font-semibold text-slate-900">{certificate.title}</h3>
                <p className="text-sm text-slate-500">{certificate.enrollment.course.title}</p>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p>Issued {formatDate(certificate.issuedOn)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <a
                href={certificate.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-primary hover:text-secondary"
              >
                View certificate →
              </a>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Uploaded</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default CertificateTracker;
