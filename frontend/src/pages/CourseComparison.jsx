import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import ComparisonTable from '../components/ComparisonTable.jsx';

const CourseComparison = () => {
  const [courses, setCourses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ provider: '', category: '', platform: 'internal' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { data } = await api.get('/courses', { params: { platform: filters.platform } });
        setProviders([...new Set(data.data.map((course) => course.provider))]);
        setCategories([...new Set(data.data.map((course) => course.category))]);
      } catch (error) {
        console.error('Failed to load course filters', error);
      }
    };
    bootstrap();
  }, [filters.platform]);

  const fetchCourses = useMemo(
    () => async () => {
      try {
        setLoading(true);
        const params = { platform: filters.platform };
        if (filters.provider) params.provider = filters.provider;
        if (filters.category) params.category = filters.category;
        const { data } = await api.get('/courses', { params });
        setCourses(data.data);
      } catch (error) {
        console.error('Failed to load courses', error);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleToggle = (courseId) => {
    setSelectedIds((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, courseId];
    });
  };

  useEffect(() => {
    const fetchComparison = async () => {
      if (!selectedIds.length) {
        setComparisonResults([]);
        return;
      }
      try {
        const { data } = await api.get('/courses/compare', {
          params: { ids: selectedIds.join(','), platform: filters.platform }
        });
        setComparisonResults(data.data);
      } catch (error) {
        console.error('Failed to load comparison data', error);
      }
    };
    fetchComparison();
  }, [selectedIds]);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white/90 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Compare courses side by side</h1>
        <p className="mt-2 text-sm text-slate-500">Evaluate offerings from leading providers by content, category, and level.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <select
            value={filters.platform}
            onChange={(event) => {
              setFilters((prev) => ({ ...prev, platform: event.target.value }));
              setSelectedIds([]);
              setComparisonResults([]);
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="internal">Our Courses</option>
            <option value="external">Popular Platforms</option>
          </select>
          <select
            value={filters.provider}
            onChange={(event) => setFilters((prev) => ({ ...prev, provider: event.target.value }))}
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
            value={filters.category}
            onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <p className="self-center text-sm text-slate-500">Selected: {selectedIds.length} / 2</p>
        </div>
      </header>

      <section className="rounded-3xl bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Pick courses to compare</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {courses.map((course) => {
            const checked = selectedIds.includes(course.id);
            return (
              <label
                key={course.id}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm transition hover:border-primary/40 ${
                  checked ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggle(course.id)}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{course.title}</p>
                  <p className="text-xs text-slate-500">{course.provider} · {course.category}</p>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      <section>
        <ComparisonTable courses={comparisonResults} />
      </section>
    </div>
  );
};

export default CourseComparison;
