import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState('events');
  const [formData, setFormData] = useState({ title: '', date: '', time: '', description: '', location: '', totalSeats: 50 });
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchEvents();
    if(activeTab === 'registrations') fetchRegistrations();
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events'); 
      // Filter for UI to only show events matching admin's club name
      // Note: Ideally the backend should filter this, but for this setup we filter on frontend
      const myEvents = res.data.filter(e => e.club === user?.clubName);
      setEvents(myEvents);
    } catch (err) { console.error("Error fetching events:", err); }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await axios.get('/api/events/registrations', config);
      setRegistrations(res.data);
    } catch (err) { console.error("Error fetching registrations:", err); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/events', formData, config);
      alert('Event Created Successfully!');
      setFormData({ title: '', date: '', time: '', description: '', location: '', totalSeats: 50 });
      fetchEvents();
    } catch(err) { 
      alert(err.response?.data?.message || "Error creating event"); 
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/events/${id}`, config);
      fetchEvents();
    } catch(err) { alert("Error deleting event"); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage <span className="font-bold text-red-600">{user?.clubName}</span></p>
          </div>
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
             <button 
               onClick={() => setActiveTab('events')}
               className={`px-6 py-2 rounded-md font-bold transition ${activeTab === 'events' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
             >
               Manage Events
             </button>
             <button 
               onClick={() => setActiveTab('registrations')}
               className={`px-6 py-2 rounded-md font-bold transition ${activeTab === 'registrations' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
             >
               View Registrations
             </button>
          </div>
        </div>

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Create Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-fit">
              <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Create New Event</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-500 outline-none" placeholder="Event Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                  <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                  <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg" type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
                </div>
                <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg" placeholder="Location (e.g. Audi 1)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg" type="number" placeholder="Total Seats" value={formData.totalSeats} onChange={e => setFormData({...formData, totalSeats: e.target.value})} required />
                <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg h-32" placeholder="Event Description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                
                <button disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-200">
                  {loading ? "Creating..." : "Launch Event"}
                </button>
              </form>
            </div>
            
            {/* Event List */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Your Active Events</h3>
              {events.length === 0 && <p className="text-gray-500 italic">No events created yet.</p>}
              {events.map(ev => (
                <div key={ev._id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex justify-between items-center group hover:border-red-200 transition">
                  <div>
                    <h4 className="font-bold text-xl text-gray-900">{ev.title}</h4>
                    <div className="flex gap-4 text-sm text-gray-500 mt-2">
                       <span>📅 {new Date(ev.date).toLocaleDateString()}</span>
                       <span>📍 {ev.location}</span>
                    </div>
                    <div className="mt-3">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                        {ev.registeredUsers.length} / {ev.totalSeats} Registered
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(ev._id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white transition">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-lg text-gray-700">Student Registration Data</h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-5">Event Name</th>
                  <th className="p-5">Student Name</th>
                  <th className="p-5">Email Address</th>
                  <th className="p-5">Date Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registrations.flatMap(ev => 
                  ev.registeredUsers.map(user => (
                    <tr key={`${ev._id}-${user._id}`} className="hover:bg-gray-50 transition">
                      <td className="p-5 font-medium text-gray-900">{ev.title}</td>
                      <td className="p-5 text-gray-600">{user.name}</td>
                      <td className="p-5 text-gray-500 font-mono text-sm">{user.email}</td>
                      <td className="p-5 text-gray-400 text-sm">{new Date().toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
                {registrations.length === 0 && (
                    <tr><td colSpan="4" className="p-10 text-center text-gray-500">No registrations found yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}