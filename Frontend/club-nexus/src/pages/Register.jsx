import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx'; // Added .jsx to prevent build errors

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user', clubName: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      <Navbar />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-black border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
          
          {error && <div className="bg-red-900/30 border border-red-800 text-red-200 p-3 rounded mb-6 text-sm text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-red-600 outline-none" 
              placeholder="Full Name" 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
            <input 
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-red-600 outline-none" 
              type="email" 
              placeholder="Email Address" 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              required 
            />
            <input 
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-red-600 outline-none" 
              type="password" 
              placeholder="Password" 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              required 
            />
            
            <div className="flex gap-4 p-2 bg-gray-900 rounded-lg border border-gray-700">
              <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-2 hover:bg-gray-800 rounded transition">
                <input type="radio" name="role" className="accent-red-600" value="user" checked={formData.role === 'user'} onChange={e => setFormData({...formData, role: 'user'})} />
                <span className="text-gray-300 font-medium">Student</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-2 hover:bg-gray-800 rounded transition">
                <input type="radio" name="role" className="accent-red-600" value="admin" checked={formData.role === 'admin'} onChange={e => setFormData({...formData, role: 'admin'})} />
                <span className="text-gray-300 font-medium">Club Admin</span>
              </label>
            </div>

            {formData.role === 'admin' && (
              <input 
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-red-600 outline-none animate-fade-in" 
                placeholder="Club Name (e.g. Dhwani)" 
                onChange={e => setFormData({...formData, clubName: e.target.value})} 
                required 
              />
            )}

            <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition transform hover:-translate-y-1 shadow-lg shadow-red-900/50">
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-red-500 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}