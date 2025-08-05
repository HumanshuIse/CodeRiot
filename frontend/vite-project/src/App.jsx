// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

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

const App = () => {
  const [toastInfo, setToastInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);

  // Removed currentMatch state as CodeEditor now reliably uses localStorage
  // which is better for reload persistence.

  const showToast = useCallback((message, type) => {
    setToastInfo({ message, type });
  }, []);

  const hideToast = () => {
    setToastInfo(null);
  };

  const handleLogout = useCallback((navigate) => {
    setIsLoggedIn(false);
    setUsername('');
    setUserId(null);
    localStorage.removeItem('token');
    // **MODIFIED**: Also clear any active match data on logout.
    localStorage.removeItem('activeMatch');
    localStorage.removeItem('matchTime');
    navigate('/');
    showToast('Logged out successfully', 'success');
  }, [showToast]);

  const fetchUserProfile = useCallback(async (token, navigate) => {
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
      // **MODIFIED**: If the token is invalid/expired, log the user out completely.
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        showToast("Your session expired. Please log in again.", "error");
        handleLogout(navigate); // Pass navigate to handleLogout
      }
      throw error;
    }
  }, [showToast, handleLogout]);

  const handleLogin = useCallback(async (token, navigate) => {
    localStorage.setItem('token', token);
    try {
      await fetchUserProfile(token, navigate);
      navigate('/profile');
      showToast('Login successful!', 'success');
    } catch (error) {
      // Error is handled in fetchUserProfile
    }
  }, [fetchUserProfile, showToast]);


  // **MODIFIED**: Centralized match data persistence here.
  // This function is now the single source of truth for starting a match session.
  const handleMatchFound = useCallback((matchData, navigate) => {
    // Set the active match details and timer in localStorage *before* navigating.
    // This ensures that even if the app is slow, the data is there when CodeEditor mounts.
    localStorage.setItem('activeMatch', JSON.stringify(matchData));
    localStorage.setItem('matchTime', '0'); // Reset timer for the new match
    navigate('/editor');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // This is a placeholder navigate function for the initial check.
    // In a real app, you might want to handle this differently, but it works for now.
    const pseudoNavigate = (path) => window.location.pathname = path;
    if (token) {
      fetchUserProfile(token, pseudoNavigate).catch(() => {});
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
        handleMatchFound={handleMatchFound}
        showToast={showToast}
      />
    </BrowserRouter>
  );
};

const AppContent = ({
  toastInfo,
  hideToast,
  isLoggedIn,
  username,
  handleLogout,
  handleLogin,
  userId,
  handleMatchFound,
  showToast,
}) => {
  const navigate = useNavigate();
  const [authTab, setAuthTab] = useState('login');

  const handleGetStarted = useCallback(() => {
    navigate('/auth');
    setAuthTab('login');
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
        onLogout={() => handleLogout(navigate)}
      />
      <Routes>
        <Route path="/" element={<Home onGetStarted={handleGetStarted} />} />
        {/* **MODIFIED**: CodeEditor no longer needs props, it's self-sufficient with localStorage. */}
        <Route path="/editor" element={
          isLoggedIn ? (
            <CodeEditor onToast={showToast} />
          ) : (
            <AuthPage authTab={authTab} setAuthTab={setAuthTab} onLoginSuccess={(token) => handleLogin(token, navigate)} showToast={showToast} />
          )
        } />
        <Route path="/matchmaking" element={
          isLoggedIn ? (
            <Matchmaking userId={userId} username={username} onToast={showToast} onMatchFound={(matchData) => handleMatchFound(matchData, navigate)} />
          ) : (
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
            <UserProfile onToast={showToast} navigate={navigate} />
          ) : (
            <AuthPage authTab={authTab} setAuthTab={setAuthTab} onLoginSuccess={(token) => handleLogin(token, navigate)} showToast={showToast} />
          )
        } />
        <Route path="/submit-problem" element={
          isLoggedIn ? (
            <ProblemSubmissionForm onToast={showToast} />
          ) : (
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

const AuthPage = ({ authTab, setAuthTab, onLoginSuccess, showToast }) => (
    // ... No changes to this component
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