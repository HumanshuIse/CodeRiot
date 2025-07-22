// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
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
import Matchmaking from './pages/Matchmaking';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [authTab, setAuthTab] = useState('login');
  const [toastInfo, setToastInfo] = useState(null);
  
  // State for user session
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);

  // State for the current match
  const [currentMatch, setCurrentMatch] = useState(null);

  const showToast = (message, type) => {
    setToastInfo({ message, type });
  };

  const hideToast = () => {
    setToastInfo(null);
  };

  // ✅ REFACTORED: Central function to fetch profile data using a token
  const fetchUserProfile = useCallback(async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setIsLoggedIn(true);
      setUsername(response.data.username);
      setUserId(response.data.id);
      return response.data; // Return data for chaining
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      localStorage.removeItem('token'); // Clear invalid token
      setIsLoggedIn(false);
      setUsername('');
      setUserId(null);
      showToast("Your session expired. Please log in again.", "error");
      throw error; // Re-throw error to stop login chain
    }
  }, []);

  // ✅ CHANGED: handleLogin now takes a token, stores it, and fetches the profile.
  const handleLogin = async (token) => {
    localStorage.setItem('token', token);
    try {
      await fetchUserProfile(token); // Fetch profile immediately
      setActiveTab('user-profile');
      showToast('Login successful!', 'success');
    } catch (error) {
      // Error is already handled in fetchUserProfile, no need to do anything here
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setUserId(null);
    setCurrentMatch(null); // Clear match data on logout
    localStorage.removeItem('token');
    setActiveTab('home');
    showToast('Logged out successfully', 'success');
  };

  const handleMatchFound = (matchData) => {
    setCurrentMatch(matchData);
    setActiveTab('editor'); // Switch to the editor when a match is found
  };
  
  const handleGetStarted = () => {
    setActiveTab('auth');
    setAuthTab('login');
  };

  // ✅ This useEffect now uses the central fetchUserProfile function
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token).catch(() => {
        // If fetch fails on load, user is already notified and logged out
      });
    }
  }, [fetchUserProfile]); // Add fetchUserProfile to dependency array


  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onGetStarted={handleGetStarted} setActiveTab={setActiveTab} />;
      
      case 'editor':
        // Pass the problem and match details to the editor
        if (!isLoggedIn) {
          showToast("Please log in to use the editor.", "error");
          setActiveTab('auth');
          return null;
        }
        return <CodeEditor problem={currentMatch?.problem} match={currentMatch} />;

      case 'matchmaking':
        if (!isLoggedIn) {
          showToast("Please log in to find a match.", "error");
          setActiveTab('auth');
          return null;
        }
        return <Matchmaking userId={userId} username={username} onToast={showToast} onMatchFound={handleMatchFound} setActiveTab={setActiveTab} />;

      case 'leaderboard':
        return (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <h2 className="text-3xl font-pixel text-white">Leaderboard (Coming Soon)</h2>
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
                <h1 className="text-4xl font-pixel text-white">CodeRiot</h1>
              </div>
              <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 pixel-border">
                <div className="flex border-b border-gray-700">
                  <button onClick={() => setAuthTab('login')} className={`flex-1 py-4 font-tech ${ authTab === 'login' ? 'bg-gray-800 text-white' : 'text-gray-400' }`}>Login</button>
                  <button onClick={() => setAuthTab('register')} className={`flex-1 py-4 font-tech ${ authTab === 'register' ? 'bg-gray-800 text-white' : 'text-gray-400' }`}>Register</button>
                </div>
                <div className="p-8">
                  {/* Pass handleLogin to UserLogin and UserRegister */}
                  {authTab === 'login' && <UserLogin onToast={showToast} onLoginSuccess={handleLogin} />}
                  {authTab === 'register' && <UserRegister onToast={showToast} onLoginSuccess={handleLogin} />}
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <Home onGetStarted={handleGetStarted} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx global>{`
        /* Your global styles remain the same */
      `}</style>
      
      {toastInfo && (
        <div className="fixed top-4 right-4 z-50">
          <Toast message={toastInfo.message} type={toastInfo.type} onClose={hideToast} />
        </div>
      )}
      
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
      />

      {renderContent()}
    </div>
  );
};

export default App;