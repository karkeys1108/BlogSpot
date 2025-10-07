import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-primary'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-semibold text-primary">
          Blogspot
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <NavLink to="/dashboard" className={navLinkClasses}>
                Dashboard
              </NavLink>
              <NavLink to="/courses" className={navLinkClasses}>
                Courses
              </NavLink>
              <NavLink to="/compare" className={navLinkClasses}>
                Compare
              </NavLink>
              <NavLink to="/certificates" className={navLinkClasses}>
                Certificates
              </NavLink>
              <NavLink to="/classrooms" className={navLinkClasses}>
                Classrooms
              </NavLink>
                <NavLink to="/profile" className={navLinkClasses}>
                  Profile
                </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary/90"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className={navLinkClasses}>
                Login
              </NavLink>
              <NavLink to="/register" className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90">
                Get Started
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
