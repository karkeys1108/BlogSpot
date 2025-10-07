import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import useAuth from '../hooks/useAuth.js';
import { formatDate } from '../utils/formatDate.js';

const defaultLists = { owned: [], joined: [] };

const Classrooms = () => {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState(defaultLists);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [createPayload, setCreatePayload] = useState({ name: '', description: '' });
  const [feedback, setFeedback] = useState(null);
  const members = selectedDetail?.members ?? [];

  const fetchClassrooms = async () => {
    setLoadingList(true);
    try {
      const { data } = await api.get('/classrooms');
      setClassrooms(data.data || defaultLists);
    } catch (error) {
      console.error('Failed to fetch classrooms', error);
      setClassrooms(defaultLists);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchDetail = async (id) => {
    if (!id) {
      setSelectedDetail(null);
      return;
    }

    setLoadingDetail(true);
    try {
      const { data } = await api.get(`/classrooms/${id}`);
      setSelectedDetail(data.data);
    } catch (error) {
      console.error('Failed to load classroom detail', error);
      setSelectedDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchDetail(selectedId);
    }
  }, [selectedId]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setFeedback(null);
    if (!createPayload.name.trim()) {
      setFeedback({ type: 'error', message: 'Classroom name is required.' });
      return;
    }

    try {
      const { data } = await api.post('/classrooms', {
        name: createPayload.name.trim(),
        description: createPayload.description.trim()
      });
      setFeedback({ type: 'success', message: `Classroom "${data.data.name}" created. Share code ${data.data.code}.` });
      setCreatePayload({ name: '', description: '' });
      await fetchClassrooms();
      setSelectedId(data.data.id);
    } catch (error) {
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Failed to create classroom.' });
    }
  };

  const handleJoin = async (event) => {
    event.preventDefault();
    setFeedback(null);
    if (!joinCode.trim()) {
      setFeedback({ type: 'error', message: 'Enter the classroom code to join.' });
      return;
    }

    try {
      const { data } = await api.post('/classrooms/join', { code: joinCode.trim() });
      setFeedback({ type: 'success', message: `Joined classroom "${data.data.name}".` });
      setJoinCode('');
      await fetchClassrooms();
      setSelectedId(data.data.id);
    } catch (error) {
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Failed to join classroom.' });
    }
  };

  const owned = classrooms.owned || [];
  const joined = classrooms.joined || [];
  const allClassrooms = useMemo(() => [...owned, ...joined], [owned, joined]);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Classrooms</h1>
          <p className="mt-2 text-sm text-slate-500">Create a classroom to track learner progress or join one with a shared code.</p>
        </div>

        {user?.role === 'faculty' && (
          <form onSubmit={handleCreate} className="rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">Create classroom</h2>
            <p className="mt-1 text-sm text-primary/80">Generate a space for your cohort and share the invite code.</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  value={createPayload.name}
                  onChange={(event) => setCreatePayload((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="e.g. Spring 2024 Data Science"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={createPayload.description}
                  onChange={(event) => setCreatePayload((prev) => ({ ...prev, description: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  rows={3}
                  placeholder="What is this classroom for?"
                />
              </div>
              <button type="submit" className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90">
                Create classroom
              </button>
            </div>
          </form>
        )}

        <form onSubmit={handleJoin} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Join classroom</h2>
          <p className="mt-1 text-sm text-slate-500">Enter the invite code shared by your instructor.</p>
          <div className="mt-4 flex flex-col gap-3">
            <input
              type="text"
              value={joinCode}
              onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase tracking-widest focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="ABC123"
            />
            <button type="submit" className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary/90">
              Join classroom
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Your classrooms</h2>
          {loadingList ? (
            <p className="mt-3 text-sm text-slate-500">Loading classrooms…</p>
          ) : allClassrooms.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">You&apos;re not part of any classrooms yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {allClassrooms.map((classroom) => (
                <li key={classroom.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(classroom.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                      selectedId === classroom.id ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 hover:border-primary/40 hover:bg-primary/5'
                    }`}
                  >
                    <span className="font-semibold">{classroom.name}</span>
                    {classroom.code && <span className="ml-2 text-xs uppercase tracking-widest text-primary">{classroom.code}</span>}
                    <span className="mt-1 block text-xs text-slate-500">Members: {classroom.memberCount}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {feedback && (
          <div
            className={`rounded-2xl border p-4 text-sm ${
              feedback.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>

      <div className="lg:col-span-2">
        {!selectedId ? (
          <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Select a classroom</h3>
              <p className="mt-2 text-sm text-slate-500">Choose a classroom from the left to view member progress and certificates.</p>
            </div>
          </div>
        ) : loadingDetail ? (
          <div className="flex h-full items-center justify-center rounded-3xl border border-slate-200 bg-white p-12">
            <p className="text-sm text-slate-500">Loading classroom details…</p>
          </div>
        ) : !selectedDetail ? (
          <div className="flex h-full items-center justify-center rounded-3xl border border-slate-200 bg-white p-12">
            <p className="text-sm text-slate-500">We couldn&apos;t load this classroom right now.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{selectedDetail.name}</h2>
                  {selectedDetail.description && (
                    <p className="mt-2 max-w-2xl text-sm text-slate-600">{selectedDetail.description}</p>
                  )}
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p>
                    Created {formatDate(selectedDetail.createdAt)}
                  </p>
                  <p className="mt-1">Members: {selectedDetail.memberCount}</p>
                  {selectedDetail.code && selectedDetail.canManage && (
                    <p className="mt-1 text-xs uppercase tracking-[0.4em] text-primary">Code: {selectedDetail.code}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Member performance</h3>
              {members.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">No members have joined yet.</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-slate-600">Learner</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">In progress</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Completed</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Avg progress</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Certificates</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {members.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900">{member.name}</div>
                            <div className="text-xs text-slate-500">{member.email}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{member.stats.inProgress}</td>
                          <td className="px-4 py-3 text-slate-600">{member.stats.completed}</td>
                          <td className="px-4 py-3 text-slate-600">{member.stats.averageProgress}%</td>
                          <td className="px-4 py-3 text-slate-600">{member.stats.certificateCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Certificates</h3>
              {members.every((member) => member.certificates.length === 0) ? (
                <p className="mt-3 text-sm text-slate-500">No certificates available yet.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {members.map((member) =>
                    member.certificates.map((certificate) => (
                      <li key={`${member.id}-${certificate.id}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{certificate.title}</p>
                            {certificate.courseTitle && <p className="text-xs text-slate-500">Course: {certificate.courseTitle}</p>}
                            <p className="text-xs text-slate-500">Issued {formatDate(certificate.issuedOn)}</p>
                          </div>
                          <div className="text-right text-xs text-slate-500">
                            <p className="font-semibold text-slate-700">{member.name}</p>
                            <a
                              href={certificate.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline"
                            >
                              View certificate
                            </a>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classrooms;
