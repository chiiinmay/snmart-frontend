import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector(s => s.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data } = await API.post('/auth/login', { email, password });
      dispatch(loginSuccess(data));
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      dispatch(loginFailure(msg));
      toast.error(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fadeInUp">
        <div className="auth-header">
          <h1>Welcome Back 🌿</h1>
          <p>Login to your Sri Nanjundeshwara Mart account</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label><FiMail /> Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label><FiLock /> Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'} <FiArrowRight />
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
