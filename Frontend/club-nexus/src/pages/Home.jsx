import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx'; // Added .jsx to prevent build errors
import { useAuth } from '../context/AuthContext.jsx'; // Added .jsx to prevent build errors

export default function Home() {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch all events
    axios.get('/api/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error("Error fetching events:", err));
  }, []);

  const handleRegister = async (eventId) => {
    if (!user) return alert("Please login first!");
    
    const token = localStorage.getItem('token');
    try {
      await axios.post(`/api/events/${eventId}/register`, {}, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      alert("Registration Successful!");
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />
      
      {/* Hero */}
      <div className="bg-black text-white py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900 z-0 opacity-80"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-6xl font-extrabold mb-4 tracking-tight">
            Club<span className="text-red-600">Nexus</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The central hub for all student clubs and events at Chitkara University.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-10 border-l-8 border-red-600 pl-6">
          Upcoming Events
        </h2>
        
        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">No events scheduled yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => {
              const seatsLeft = event.totalSeats - event.registeredUsers.length;
              const isFull = seatsLeft <= 0;

              return (
                <div key={event._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100">
                  {/* Card Header */}
                  <div className="bg-black p-6 relative">
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase">
                      {event.club}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-red-500 transition">{event.title}</h3>
                    <p className="text-gray-400 text-sm">📍 {event.location}</p>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm font-medium text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                         📅 {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                         ⏰ {event.time}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                       <span className={`text-sm font-bold ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                         {isFull ? "HOUSEFULL" : `${seatsLeft} Seats Available`}
                       </span>
                    </div>

                    <button 
                      onClick={() => handleRegister(event._id)}
                      disabled={isFull}
                      className={`w-full py-3 rounded-lg font-bold uppercase tracking-wide transition-all
                        ${isFull 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200'
                        }`}
                    >
                      {isFull ? "Registration Closed" : "Register Now"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}