import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // Added .jsx
import Home from './pages/Home.jsx'; // Added .jsx
import Login from './pages/Login.jsx'; // Added .jsx
import Register from './pages/Register.jsx'; // Added .jsx
import AdminDashboard from './pages/AdminDashboard.jsx'; // Added .jsx

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </AuthProvider>
  );
}