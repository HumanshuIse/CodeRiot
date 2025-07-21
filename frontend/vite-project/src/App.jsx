// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
import Matchmaking from './pages/Matchmaking'; // ✅ Import Matchmaking

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [authTab, setAuthTab] = useState('login');
  const [toastInfo, setToastInfo] = useState(null);
  
  // State for user session
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null); // ✅ Added state for userId

  const showToast = (message, type) => {
    setToastInfo({ message, type });
  };

  const hideToast = () => {
    setToastInfo(null);
  };

  // ✅ Updated to handle full user data, including ID
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUsername(userData.username);
    setUserId(userData.id); // Assume login response includes user ID
    setActiveTab('user-profile');
    showToast('Login successful!', 'success');
  };

  // ✅ Updated to clear all user data on logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setUserId(null);
    localStorage.removeItem('token');
    setActiveTab('home');
    showToast('Logged out successfully', 'success');
  };

  const handleGetStarted = () => {
    setActiveTab('auth');
    setAuthTab('login');
  };

  // ✅ Added Matchmaking and Leaderboard cases
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onGetStarted={handleGetStarted} setActiveTab={setActiveTab} />;
      
      case 'editor':
        return <CodeEditor />;

      case 'matchmaking': // ✅ NEW: Matchmaking Page Route
        if (!isLoggedIn) {
          showToast("Please log in to find a match.", "error");
          setActiveTab('auth');
          return null;
        }
        return <Matchmaking userId={userId} username={username} onToast={showToast} setActiveTab={setActiveTab} />;

      case 'leaderboard': // ✅ NEW: Leaderboard Page Route
        return (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-pixel text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-shadow-neon">Leaderboard</h2>
              <p className="text-gray-300 font-tech">See who's dominating the coding arena!</p>
            </div>
          </div>
        );
      
      case 'user-profile':
        if (!isLoggedIn) {
          showToast("Please log in to view your profile.", "error");
          setActiveTab('auth');
          return null;
        }
        return <UserProfile onToast={showToast} setActiveTab={setActiveTab} />;

      case 'submit-problem':
        if (!isLoggedIn) {
          showToast("Please log in to submit a problem.", "error");
          setActiveTab('auth');
          return null;
        }
        return <ProblemSubmissionForm onToast={showToast} />;
      
      case 'auth':
        return (
          <div className="min-h-screen bg-black flex items-center justify-center py-8">
            <div className="w-full max-w-md px-4">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-pixel text-white mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-shadow-neon">
                  Welcome to CodeRiot
                </h1>
                <p className="text-gray-300 text-lg font-tech">Your coding journey starts here</p>
              </div>
              <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-gray-700 pixel-border animate-glow-slow">
                <div className="flex border-b border-gray-700">
                  <button onClick={() => setAuthTab('login')} className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 font-tech ${ authTab === 'login' ? 'bg-gray-800 text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white bg-gray-700' }`}>
                    Login
                  </button>
                  <button onClick={() => setAuthTab('register')} className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 font-tech ${ authTab === 'register' ? 'bg-gray-800 text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white bg-gray-700' }`}>
                    Register
                  </button>
                </div>
                <div className="p-8">
                  {authTab === 'login' && (
                    <UserLogin onToast={showToast} onLogin={handleLogin} />
                  )}
                  {authTab === 'register' && (
                    <UserRegister onToast={showToast} onLogin={handleLogin} />
                  )}
                </div>
              </div>
              <div className="text-center mt-8 text-gray-500 text-sm font-tech">
                <p>© {new Date().getFullYear()} CodeRiot. All rights reserved.</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return <Home onGetStarted={handleGetStarted} setActiveTab={setActiveTab} />;
    }
  };

  // ✅ Improved session check on initial app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8000/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => {
        // Assuming profile response includes id and username
        setIsLoggedIn(true);
        setUsername(response.data.username);
        setUserId(response.data.id);
      })
      .catch(error => {
        console.error("Failed to fetch user profile on app load:", error);
        localStorage.removeItem('token'); // Clear invalid token
        setIsLoggedIn(false);
        setUsername('');
        setUserId(null);
        showToast("Your session expired. Please log in again.", "error");
      });
    }
  }, []); // Run only once on component mount

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        .font-tech { font-family: 'Rajdhani', sans-serif; }
        @font-face {
          font-family: 'PressStart2P';
          src: url('/src/assets/fonts/PressStart2P.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        .font-pixel { font-family: 'PressStart2P', 'Courier New', monospace; }
        .pixel-border { border-image: linear-gradient(45deg, #00ffff, #ff00ff) 1; border-style: solid; border-width: 2px; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff; } 50% { box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; } }
        .text-shadow-neon {
          text-shadow:
            0 0 5px currentColor,
            0 0 10px currentColor,
            0 0 15px currentColor,
            0 0 20px currentColor;
        }
        .animate-glow-slow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
      
      {/* Toast Notification */}
      {toastInfo && (
        <div className="fixed top-4 right-4 z-50">
          <Toast message={toastInfo.message} type={toastInfo.type} onClose={hideToast} />
        </div>
      )}
      
      {/* Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      {renderContent()}
    </div>
  );
};

export default App;
