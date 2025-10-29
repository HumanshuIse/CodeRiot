// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';

// MODIFIED: Import new context and component
import { MatchProvider, useMatch } from './context/MatchContext';
import ReturnToMatchButton from './components/ReturnToMatchButton';

// Import Components
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import CodeEditor from './components/CodeEditor';
import ProblemSubmissionForm from './components/ProblemSubmissionForm';
import ForgotPassword from './components/ForgotPassword';

// Import Pages
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import Matchmaking from './pages/Matchmaking';
import AboutUs from './pages/AboutUs';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SubmissionsPage from './pages/SubmissionsPage';
import Leaderboard from './pages/Leaderboard';

// --- GoogleSignInButton Component ---
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.94C34.353 4.909 29.493 2.5 24 2.5C11.936 2.5 2.5 11.936 2.5 24s9.436 21.5 21.5 21.5c11.953 0 21.227-9.523 21.489-21.233c.023-.192.038-.389.038-.588c0-.621-.054-1.229-.15-1.832z" />
    <path fill="#FF3D00" d="M6.306 14.691c-2.221 4.316-2.221 9.31 0 13.626l-3.39 3.39c-3.447-6.59-3.447-14.47 0-21.06l3.39 3.39z" />
    <path fill="#4CAF50" d="M24 45.5c5.493 0 10.353-2.409 13.802-6.56l-4.998-4.998c-2.185 1.832-4.96 2.922-8.804 2.922c-5.223 0-9.66-3.343-11.303-8H2.5v8.023C6.953 41.091 14.993 45.5 24 45.5z" />
    <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.237 4.14-4.285 5.443l4.998 4.998C42.008 34.61 45.5 28.92 45.5 24c0-1.922-.22-3.81-.623-5.631l-1.266-1.286z" />
  </svg>
);

const GoogleSignInButton = () => {
  const backendUrl = import.meta.env.VITE_API_URL;
  const handleGoogleSignIn = () => {
    window.location.href = `${backendUrl}/api/auth/google`;
  };
  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center bg-white text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 pixel-border-light"
    >
      <GoogleIcon />
      Sign in with Google
    </button>
  );
};

// --- AuthCallbackPage Component ---
const AuthCallbackPage = ({ onLoginSuccess, showToast }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      onLoginSuccess(token);
    } else {
      showToast('Google authentication failed. Please try again.', 'error');
      navigate('/auth');
    }
  }, [searchParams, navigate, onLoginSuccess, showToast]);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center font-tech">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-2xl">Finalizing Login...</h1>
        <p className="text-gray-400">Please wait while we securely log you in.</p>
      </div>
    </div>
  );
};

// --- AuthPage Component (Updated for Forgot Password) ---
const AuthPage = ({ authTab, setAuthTab, onLoginSuccess, showToast }) => {
    const [view, setView] = useState('main'); 

    const renderContent = () => {
        if (view === 'forgot-password') {
            return <ForgotPassword onToast={showToast} onBackToLogin={() => setView('main')} />;
        }
        
        return (
            <>
                <GoogleSignInButton />
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-900 text-gray-400 font-tech">OR</span>
                    </div>
                </div>
                <div className="flex border border-gray-700 rounded-lg">
                    <button onClick={() => setAuthTab('login')} className={`flex-1 py-3 font-tech rounded-l-md ${ authTab === 'login' ? 'bg-gray-800 text-white' : 'text-gray-400' }`}>Login</button>
                    <button onClick={() => setAuthTab('register')} className={`flex-1 py-3 font-tech rounded-r-md ${ authTab === 'register' ? 'bg-gray-800 text-white' : 'text-gray-400' }`}>Register</button>
                </div>
                {authTab === 'login' && <UserLogin onToast={showToast} onLoginSuccess={onLoginSuccess} onForgotPassword={() => setView('forgot-password')} />}
                {authTab === 'register' && <UserRegister onToast={showToast} onLoginSuccess={onLoginSuccess} />}
            </>
        );
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center py-8">
            <div className="w-full max-w-md px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-pixel text-white">CodeRiot</h1>
                </div>
                <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 pixel-border">
                    <div className="p-8 space-y-6">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---
const App = () => {
  return (
    // MODIFIED: Wrap the BrowserRouter with MatchProvider
    <MatchProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </MatchProvider>
  );
};

// --- AppContent for Routing ---
const AppContent = () => {
  const [toastInfo, setToastInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);

  // MODIFIED: Get the endMatch function from our new context
  const { endMatch } = useMatch();
  const navigate = useNavigate();
  const [authTab, setAuthTab] = useState('login');

  const showToast = useCallback((message, type) => {
    setToastInfo({ message, type });
  }, []);

  const hideToast = () => {
    setToastInfo(null);
  };

  // MODIFIED: Update logout to use the context function
  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUsername('');
    setUserId(null);
    localStorage.removeItem('token');
    endMatch(); // This now clears match state from context and localStorage
    navigate('/');
    showToast('Logged out successfully', 'success');
  }, [showToast, navigate, endMatch]);

  const backendUrl = import.meta.env.VITE_API_URL;
  const fetchUserProfile = useCallback(async (token) => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setIsLoggedIn(true);
      setUsername(response.data.username);
      setUserId(response.data.id);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        showToast("Your session expired. Please log in again.", "error");
        handleLogout();
      }
    }
  }, [backendUrl, showToast, handleLogout]);

  const handleLogin = useCallback(async (token) => {
    localStorage.setItem('token', token);
    await fetchUserProfile(token);
    navigate('/profile');
    showToast('Login successful!', 'success');
  }, [fetchUserProfile, showToast, navigate]);
  
  // REMOVED: handleMatchFound is no longer needed here

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token).catch(() => {});
    }
  }, [fetchUserProfile]);


  const handleGetStarted = useCallback(() => {
    navigate('/auth');
    setAuthTab('login');
  }, [navigate]);

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
        onLogout={handleLogout}
      />
      
      {/* MODIFIED: Add the button here so it's visible on all pages */}
      <ReturnToMatchButton />

      <Routes>
        <Route path="/" element={<Home onGetStarted={handleGetStarted} />} />
        <Route path="/editor" element={
          isLoggedIn ? <CodeEditor onToast={showToast} /> : <AuthPage authTab={authTab} setAuthTab={setAuthTab} onLoginSuccess={handleLogin} showToast={showToast} />
        } />
        <Route path="/matchmaking" element={
          isLoggedIn ? <Matchmaking userId={userId} username={username} onToast={showToast} /> : <AuthPage authTab={authTab} setAuthTab={setAuthTab} onLoginSuccess={handleLogin} showToast={showToast} />
        } />
        <Route path="/leaderboard" element={<Leaderboard onToast={showToast} />} />
        <Route path="/profile" element={
          isLoggedIn ? <UserProfile onToast={showToast} navigate={navigate} /> : <AuthPage authTab={authTab} setAuthTab={setAuthTab} onLoginSuccess={handleLogin} showToast={showToast} />
        } />
        <Route path="/submit-problem" element={
          isLoggedIn ? <ProblemSubmissionForm onToast={showToast} /> : <AuthPage authTab={authTab} setAuthTab={setAuthTab} onLoginSuccess={handleLogin} showToast={showToast} />
        } />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/auth" element={
          <AuthPage authTab={authTab} setAuthTab={setAuthTab} onLoginSuccess={handleLogin} showToast={showToast} />
        } />
        <Route path="/auth/callback" element={
          <AuthCallbackPage onLoginSuccess={handleLogin} showToast={showToast} />
        } />
        
        <Route path="/reset-password" element={<ResetPasswordPage showToast={showToast} />} />
        <Route path="/submissions" element={
                    isLoggedIn ? <SubmissionsPage onToast={showToast} /> : <AuthPage authTab={authTab} setAuthTab={setAuthTab} onLoginSuccess={handleLogin} showToast={showToast} />
        } />
      </Routes>
    </div>
  );
};


export default App;