// src/pages/UserProfile.jsx
"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User as UserIcon, Mail, Loader2, FilePlus } from 'lucide-react'; // ✅ Import FilePlus
import { Button } from "@/components/ui/button"; // Assuming Button component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserProfile = ({ onToast, setActiveTab }) => { // ✅ Added setActiveTab prop
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          onToast("You are not logged in.", "error");
          // Optionally redirect to login if not authenticated
          setActiveTab('auth'); // Redirect to auth tab
          return;
        }

        const response = await axios.get('http://localhost:8000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        const errorMessage = err.response?.data?.detail || 'Failed to load profile. Please try again.';
        onToast(errorMessage, 'error');
        setError(errorMessage);
        setActiveTab('home'); // Redirect to home on error or if token is invalid
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [onToast, setActiveTab]); // Depend on onToast and setActiveTab

  const fontPixelClassName = "font-pixel bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-shadow-neon";
  const fontTechClassName = "font-tech text-gray-300";
  const cardClassName = "bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-gray-700 pixel-border animate-glow-slow";
  const buttonClassName = "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 font-tech font-semibold text-base rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-tech">
        <Loader2 className="w-8 h-8 animate-spin mr-3 text-blue-400" />
        <p>Loading profile...</p>
      </div>
    );
  }

  // Handle case where user data is null after loading (e.g., token invalid or fetch error redirects)
  if (!userData) {
    return null; // App.jsx will handle redirection or error message
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4 relative z-10">
      <div className="w-full max-w-md">
        <Card className={cardClassName}>
          <CardHeader className="text-center mb-6">
            <CardTitle className={`text-4xl ${fontPixelClassName} mb-4`}>
              User Profile
            </CardTitle>
            <p className={`text-lg ${fontTechClassName}`}>Your personal details.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <UserIcon className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-gray-400 text-sm font-tech">Username</p>
                <p className="text-xl font-semibold font-tech">{userData.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm font-tech">Email</p>
                <p className="text-xl font-semibold font-tech">{userData.email}</p>
              </div>
            </div>
            
            {/* ✅ NEW: Contribute a Problem button */}
            <div className="pt-6 border-t border-gray-800 mt-6 text-center">
              <Button onClick={() => setActiveTab('submit-problem')} className={buttonClassName}>
                <FilePlus className="w-5 h-5 mr-2" />
                Contribute a Problem
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;