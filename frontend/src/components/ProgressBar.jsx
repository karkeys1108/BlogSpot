import PropTypes from 'prop-types';

const ProgressBar = ({ value }) => {
  return (
    <div className="h-2.5 w-full rounded-full bg-slate-200">
      <div className="h-2.5 rounded-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${value}%` }} />
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number
};

ProgressBar.defaultProps = {
  value: 0
};

export default ProgressBar;
