import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Login.css';
import { LogIn, ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;
      
      if (user.role !== 'ADMIN') {
        throw new Error('Access denied. Admin only.');
      }
      
      localStorage.setItem('admin_token', access_token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card glass"
      >
        <div className="login-header">
          <div className="icon-badge">
            <ShieldCheck size={32} color="var(--primary)" />
          </div>
          <h1>Admin Portal</h1>
          <p>Login to manage the education platform</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label><Mail size={16} /> Email</label>
            <input 
              type="email" 
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label><Lock size={16} /> Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="error-message"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? <span className="loader"></span> : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>
      </motion.div>
      
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
    </div>
  );
};

export default Login;
