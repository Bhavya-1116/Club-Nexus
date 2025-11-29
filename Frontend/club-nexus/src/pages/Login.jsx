import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Added .jsx
import axios from 'axios';
import Navbar from '../components/Navbar.jsx'; // Added .jsx

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      
      const userData = res.data.user;
      const token = res.data.token;

      login(userData, token);

      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      <Navbar />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-black border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h2>
          <p className="text-gray-400 text-center mb-8">Login to manage or join events</p>
          
          {error && <div className="bg-red-900/30 border border-red-800 text-red-200 p-3 rounded mb-6 text-sm text-center">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email Address</label>
              <input 
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-red-600 focus:outline-none transition" 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Password</label>
              <input 
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-red-600 focus:outline-none transition" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button 
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition transform hover:-translate-y-1 shadow-lg shadow-red-900/50 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            New here? <Link to="/register" className="text-red-500 font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}