import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight } from 'react-icons/fi';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      dispatch(loginSuccess(data));
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fadeInUp">
        <div className="auth-header">
          <h1>Create Account 🌱</h1>
          <p>Join Sri Nanjundeshwara Mart for natural wellness</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group"><label><FiUser /> Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required /></div>
          <div className="form-group"><label><FiMail /> Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required /></div>
          <div className="form-group"><label><FiPhone /> Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" /></div>
          <div className="form-group"><label><FiLock /> Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required /></div>
          <div className="form-group"><label><FiLock /> Confirm Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" required /></div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'} <FiArrowRight />
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}
