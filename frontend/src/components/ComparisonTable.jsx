import PropTypes from 'prop-types';

const ComparisonTable = ({ courses }) => {
  if (!courses.length) {
    return <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">Select courses to compare</div>;
  }

  const headers = ['Title', 'Provider', 'Category', 'Description', 'Level'];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {courses.map((course) => (
            <tr key={course.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 text-sm font-semibold text-slate-900">{course.title}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{course.provider}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{course.category}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{course.description}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{course.level || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ComparisonTable.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      provider: PropTypes.string,
      category: PropTypes.string,
      description: PropTypes.string,
      level: PropTypes.string
    })
  )
};

ComparisonTable.defaultProps = {
  courses: []
};

export default ComparisonTable;
