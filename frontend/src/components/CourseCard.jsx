import PropTypes from 'prop-types';
import { BookOpenIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

const CourseCard = ({ course, onEnroll, enrolled }) => {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-primary">{course.provider}</span>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{course.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{course.description}</p>
        </div>
        <BookOpenIcon className="h-8 w-8 text-primary/60" />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
          <AcademicCapIcon className="h-4 w-4" /> {course.category}
        </span>
        {course.level && <span className="font-medium capitalize">{course.level}</span>}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <a href={course.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:text-secondary">
          View details →
        </a>
        <button
          type="button"
          onClick={() => onEnroll(course.id)}
          className={classNames(
            'rounded-lg px-4 py-2 text-sm font-semibold transition',
            enrolled ? 'bg-emerald-100 text-emerald-700' : 'bg-primary text-white hover:bg-primary/90'
          )}
          disabled={enrolled}
        >
          {enrolled ? 'Enrolled' : 'Enroll'}
        </button>
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    provider: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    level: PropTypes.string,
    url: PropTypes.string
  }).isRequired,
  onEnroll: PropTypes.func.isRequired,
  enrolled: PropTypes.bool
};

CourseCard.defaultProps = {
  enrolled: false
};

export default CourseCard;
