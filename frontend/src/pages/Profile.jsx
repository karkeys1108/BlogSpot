import { useEffect, useState } from 'react';
import api from '../services/api.js';
import useAuth from '../hooks/useAuth.js';
import ProgressBar from '../components/ProgressBar.jsx';
import { formatDate } from '../utils/formatDate.js';

const Profile = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await api.get('/enrollments/mine');
        setEnrollments(data.data);
      } catch (error) {
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary px-8 py-12 text-white shadow-xl">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-br from-primary/80 to-secondary/80 p-6 shadow-lg">
            <p className="text-sm text-white/80">Total enrollments</p>
            <p className="mt-2 text-3xl font-semibold text-white">{enrollments.length}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-secondary/80 to-primary/60 p-6 shadow-lg">
            <p className="text-sm text-white/80">In progress</p>
            <p className="mt-2 text-3xl font-semibold text-white">{enrollments.filter(e => e.status === 'in-progress').length}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500/80 to-primary/60 p-6 shadow-lg">
            <p className="text-sm text-white/80">Completed</p>
            <p className="mt-2 text-3xl font-semibold text-white">{enrollments.filter(e => e.status === 'completed').length}</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-slate-900">Your enrolled courses</h2>
        <div className="mt-4 space-y-4">
          {loading && <p className="text-sm text-slate-500">Loading enrollments…</p>}
          {!loading && enrollments.length === 0 && <p className="text-sm text-slate-500">You haven&apos;t enrolled in any courses yet.</p>}
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-wider text-primary">{enrollment.course.provider}</p>
                  <h3 className="text-lg font-semibold text-slate-900">{enrollment.course.title}</h3>
                  <p className="text-sm text-slate-500">{enrollment.course.category}</p>
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p>Status: <span className="font-semibold text-slate-700">{enrollment.status}</span></p>
                  {enrollment.completedAt && <p>Completed: {formatDate(enrollment.completedAt)}</p>}
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={enrollment.progress} />
                <p className="mt-2 text-sm text-slate-500">Progress: {Math.round(enrollment.progress)}%</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;
