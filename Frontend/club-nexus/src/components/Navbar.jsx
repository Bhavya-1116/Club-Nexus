import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-black text-white p-4 shadow-xl border-b border-red-800 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-widest uppercase hover:text-red-500 transition">
          Club<span className="text-red-600">Nexus</span>
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-6 font-medium">
          <Link to="/" className="hover:text-red-500 transition">Home</Link>
          
          {user && user.role === 'admin' && (
            <Link to="/admin-dashboard" className="text-red-500 hover:text-white transition border border-red-600 px-3 py-1 rounded">
              Admin Panel
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4 border-l border-gray-700 pl-4">
              <span className="text-gray-300 text-sm hidden md:block">
                Hello, <span className="font-bold text-white">{user.name}</span>
              </span>
              <button 
                onClick={logout} 
                className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="px-4 py-2 hover:text-red-500 transition">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}