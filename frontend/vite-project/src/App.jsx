// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'; // Import router components and hook

// Import Components
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import CodeEditor from './components/CodeEditor';
import ProblemSubmissionForm from './components/ProblemSubmissionForm';

// Import Pages
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import Matchmaking from './pages/Matchmaking';

// Main App component wrapped with BrowserRouter for routing
const App = () => {
  const [authTab, setAuthTab] = useState('login');
  const [toastInfo, setToastInfo] = useState(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);

  const [currentMatch, setCurrentMatch] = useState(null);

  // useCallback for stable prop functions to prevent unnecessary re-renders in children
  const showToast = useCallback((message, type) => {
    setToastInfo({ message, type });
  }, []);

  const hideToast = () => {
    setToastInfo(null);
  };

  const fetchUserProfile = useCallback(async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setIsLoggedIn(true);
      setUsername(response.data.username);
      setUserId(response.data.id);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUsername('');
      setUserId(null);
      showToast("Your session expired. Please log in again.", "error");
      throw error;
    }
  }, [showToast]);

  // handleLogin now receives navigate from the component where it's called
  const handleLogin = useCallback(async (token, navigate) => { // Added navigate as a parameter
    localStorage.setItem('token', token);
    try {
      await fetchUserProfile(token);
      navigate('/profile'); // Use navigate to go to profile page
      showToast('Login successful!', 'success');
    } catch (error) {
      // Error is handled in fetchUserProfile
    }
  }, [fetchUserProfile, showToast]);

  const handleLogout = useCallback((navigate) => { // Added navigate as a parameter
    setIsLoggedIn(false);
    setUsername('');
    setUserId(null);
    setCurrentMatch(null);
    localStorage.removeItem('token');
    navigate('/'); // Use navigate to go to home page
    showToast('Logged out successfully', 'success');
  }, [showToast]);

  const handleMatchFound = useCallback((matchData, navigate) => { // Added navigate as a parameter
    setCurrentMatch(matchData);
    navigate('/editor'); // Use navigate to go to editor page
  }, []);
  
  // Effect to check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token).catch(() => {});
    }
  }, [fetchUserProfile]);

  return (
    <BrowserRouter>
      <AppContent
        toastInfo={toastInfo}
        hideToast={hideToast}
        isLoggedIn={isLoggedIn}
        username={username}
        handleLogout={handleLogout}
        handleLogin={handleLogin}
        userId={userId}
        currentMatch={currentMatch}
        handleMatchFound={handleMatchFound}
        authTab={authTab}
        setAuthTab={setAuthTab}
        showToast={showToast}
      />
    </BrowserRouter>
  );
};

// A wrapper component to use useNavigate within the BrowserRouter context
const AppContent = ({
  toastInfo,
  hideToast,
  isLoggedIn,
  username,
  handleLogout,
  handleLogin,
  userId,
  currentMatch,
  handleMatchFound,
  authTab,
  setAuthTab,
  showToast, // Destructure showToast here
}) => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle "Get Started" button click on Home page
  const handleGetStarted = useCallback(() => {
    navigate('/auth'); // Navigate to the auth route
    setAuthTab('login'); // Set default tab to login
  }, [navigate, setAuthTab]);

  return (
    <div className="min-h-screen bg-black text-white">
      {toastInfo && (
        <div className="fixed top-4 right-4 z-50">
          <Toast message={toastInfo.message} type={toastInfo.type} onClose={hideToast} />
        </div>
      )}
      <Navbar
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={() => handleLogout(navigate)} // Pass navigate to handleLogout
      />
      <Routes>
        <Route path="/" element={<Home onGetStarted={handleGetStarted} />} />
        <Route path="/editor" element={
          isLoggedIn ? (
            <CodeEditor problem={currentMatch?.problem} match={currentMatch} />
          ) : (
            // Redirect to auth if not logged in
            <AuthPage authTab={authTab} setAuthTab={setAuthTab} onLoginSuccess={(token) => handleLogin(token, navigate)} showToast={showToast} />
          )
        } />
        <Route path="/matchmaking" element={
          isLoggedIn ? (
            <Matchmaking userId={userId} username={username} onToast={showToast} onMatchFound={(matchData) => handleMatchFound(matchData, navigate)} />
          ) : (
            // Redirect to auth if not logged in
            <AuthPage authTab={authTab} setAuthTab={setAuthTab} onLoginSuccess={(token) => handleLogin(token, navigate)} showToast={showToast} />
          )
        } />
        <Route path="/leaderboard" element={
          <div className="min-h-screen flex items-center justify-center text-white font-pixel text-2xl">
            Leaderboard Coming Soon!
          </div>
        } />
        <Route path="/profile" element={
          isLoggedIn ? (
            <UserProfile onToast={showToast} navigate={navigate} /> // Pass navigate instead of setActiveTab
          ) : (
            // Redirect to auth if not logged in
            <AuthPage authTab={authTab} setAuthTab={setAuthTab} onLoginSuccess={(token) => handleLogin(token, navigate)} showToast={showToast} />
          )
        } />
        <Route path="/submit-problem" element={
          isLoggedIn ? (
            <ProblemSubmissionForm onToast={showToast} />
          ) : (
            // Redirect to auth if not logged in
            <AuthPage authTab={authTab} setAuthTab={setAuthTab} onLoginSuccess={(token) => handleLogin(token, navigate)} showToast={showToast} />
          )
        } />
        <Route path="/auth" element={
          <AuthPage authTab={authTab} setAuthTab={setAuthTab} onLoginSuccess={(token) => handleLogin(token, navigate)} showToast={showToast} />
        } />
      </Routes>
    </div>
  );
};

// Reusable AuthPage component
const AuthPage = ({ authTab, setAuthTab, onLoginSuccess, showToast }) => (
  <div className="min-h-screen bg-black flex items-center justify-center py-8">
    <div className="w-full max-w-md px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-pixel text-white">CodeRiot</h1>
      </div>
      <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 pixel-border">
        <div className="flex border-b border-gray-700">
          <button onClick={() => setAuthTab('login')} className={`flex-1 py-4 font-tech ${ authTab === 'login' ? 'bg-gray-800 text-white' : 'text-gray-400' }`}>Login</button>
          <button onClick={() => setAuthTab('register')} className={`flex-1 py-4 font-tech ${ authTab === 'register' ? 'bg-gray-800 text-white' : 'text-gray-400' }`}>Register</button>
        </div>
        <div className="p-8">
          {authTab === 'login' && <UserLogin onToast={showToast} onLoginSuccess={onLoginSuccess} />}
          {authTab === 'register' && <UserRegister onToast={showToast} onLoginSuccess={onLoginSuccess} />}
        </div>
      </div>
    </div>
  </div>
);

export default App;
