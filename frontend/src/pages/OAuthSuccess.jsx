import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAuthToken } from '../services/api.js';
import useAuth from '../hooks/useAuth.js';

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      setAuthToken(token);
      refresh();
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [params, refresh, navigate]);

  return (
    <div className="mt-24 text-center text-slate-500">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <p className="mt-4">Completing sign-in…</p>
    </div>
  );
};

export default OAuthSuccess;
