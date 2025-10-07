import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import CourseCard from '../components/CourseCard.jsx';

const CourseDiscovery = () => {
  const [courses, setCourses] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { data } = await api.get('/courses');
        setProviders([...new Set(data.data.map((course) => course.provider))]);
        setCategories([...new Set(data.data.map((course) => course.category))]);
      } catch (error) {
        console.error('Failed to load course filters', error);
      }
    };
    bootstrap();
  }, []);

  const fetchCourses = useMemo(
    () => async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedProvider) params.provider = selectedProvider;
        if (selectedCategory) params.category = selectedCategory;
        if (search) params.search = search;
        const { data } = await api.get('/courses', { params });
        setCourses(data.data);
      } catch (error) {
        console.error('Failed to load courses', error);
      } finally {
        setLoading(false);
      }
    },
    [search, selectedProvider, selectedCategory]
  );

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await api.get('/enrollments/mine');
        setEnrolledIds(new Set(data.data.map((enrollment) => enrollment.courseId)));
      } catch (error) {
        console.error('Failed to load enrollments', error);
      }
    };
    fetchEnrollments();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await api.post('/enrollments', { courseId });
      setEnrolledIds((prev) => new Set([...prev, courseId]));
    } catch (error) {
      console.error('Enrollment failed', error);
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white/90 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Discover curated courses</h1>
        <p className="mt-2 text-sm text-slate-500">
          Browse hand-picked learning experiences across Coursera, Alison, LinkedIn Learning, and beyond.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search by title or description"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:col-span-2"
          />
          <select
            value={selectedProvider}
            onChange={(event) => setSelectedProvider(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All providers</option>
            {providers.map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {loading && <p className="text-sm text-slate-500">Loading courses…</p>}
        {!loading && courses.length === 0 && (
          <p className="text-sm text-slate-500">No courses match your filters right now.</p>
        )}
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onEnroll={handleEnroll} enrolled={enrolledIds.has(course.id)} />
        ))}
      </section>
    </div>
  );
};

export default CourseDiscovery;
