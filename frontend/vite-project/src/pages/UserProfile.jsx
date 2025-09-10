// src/pages/UserProfile.jsx
"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User as UserIcon, Mail, Loader2, FilePlus, Calendar, Code, CheckSquare, History } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ onToast }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          onToast("You are not logged in.", "error");
          navigate('/auth');
          return;
        }
        const response = await axios.get(`${backendUrl}/api/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        const errorMessage = err.response?.data?.detail || 'Failed to load profile. Please try again.';
        onToast(errorMessage, 'error');
        setError(errorMessage);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/auth');
        } else {
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [onToast, navigate, backendUrl]);

  const fontPixelClassName = "font-pixel bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-shadow-neon";
  const fontTechClassName = "font-tech text-gray-300";
  const cardClassName = "bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 pixel-border animate-glow-slow";
  const buttonClassName = "w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 font-tech font-semibold text-base rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105";
  const secondaryButtonClassName = "w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-2 font-tech font-semibold text-base rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-tech">
        <Loader2 className="w-8 h-8 animate-spin mr-3 text-blue-400" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return null;
  }
  
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8 font-tech">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: USER INFO --- */}
        <div className="lg:col-span-1">
          <Card className={cardClassName}>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <img
                  src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${userData.username}`}
                  alt="User Avatar"
                  className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-cyan-500 shadow-neon-cyan"
                />
                <h2 className={`text-3xl ${fontPixelClassName}`}>{userData.username}</h2>
              </div>
              
              <div className="border-t border-gray-700 pt-6 space-y-4">
                 <div className="flex items-center space-x-4">
                   <Mail className="w-6 h-6 text-blue-400" />
                   <div>
                     <p className="text-gray-400 text-sm">Email</p>
                     <p className="text-lg font-semibold">{userData.email}</p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-4">
                   <Calendar className="w-6 h-6 text-green-400" />
                   <div>
                     <p className="text-gray-400 text-sm">Joined On</p>
                     <p className="text-lg font-semibold">{formatDateTime(userData.created_at)}</p>
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- RIGHT COLUMN: STATS & ACTIONS --- */}
        <div className="lg:col-span-2 space-y-8">
           <Card className={cardClassName}>
            <CardHeader>
              <CardTitle className={`text-xl ${fontPixelClassName}`}>Coding Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center space-x-4">
                <CheckSquare className="w-10 h-10 text-teal-400" />
                <div>
                  <p className="text-gray-400 text-sm">Problems Solved</p>
                  <p className="text-3xl font-bold">{userData.problem_solved_cnt ?? 0}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Code className="w-10 h-10 text-orange-400" />
                <div>
                  <p className="text-gray-400 text-sm">Problems Contributed</p>
                  <p className="text-3xl font-bold">{userData.problems_contributed_count ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- V V V --- ACTIONS PANEL MOVED HERE --- V V V --- */}
          <Card className={cardClassName}>
            <CardHeader>
              <CardTitle className={`text-xl ${fontPixelClassName}`}>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate('/submissions')} className={secondaryButtonClassName}>
                <History className="w-5 h-5 mr-2" /> View Submissions
              </Button>
              <Button onClick={() => navigate('/submit-problem')} className={buttonClassName}>
                <FilePlus className="w-5 h-5 mr-2" /> Contribute Problem
              </Button>
            </CardContent>
          </Card>
          {/* --- ^ ^ ^ --- END OF MOVED ACTIONS PANEL --- ^ ^ ^ --- */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;