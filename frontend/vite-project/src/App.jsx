import React, { useState } from 'react';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import Home from './pages/Home';
import CodeEditor from './components/CodeEditor'; // Import the CodeEditor component
import Navbar from './components/Navbar';
import Toast from './components/toast';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [authTab, setAuthTab] = useState('login'); // For switching between login/register
  const [toast, setToast] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUsername(userData.username);
    setActiveTab('home');
    showToast('Login successful!', 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setActiveTab('home');
    showToast('Logged out successfully', 'success');
  };

  const handleGetStarted = () => {
    setActiveTab('auth');
    setAuthTab('login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onGetStarted={handleGetStarted} setActiveTab={setActiveTab} />;
      
      case 'editor':
        return <CodeEditor />;
      
      case 'matchmaking':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Matchmaking</h2>
              <p className="text-gray-600">Find your coding opponent and start battling!</p>
            </div>
          </div>
        );
      
      case 'leaderboard':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Leaderboard</h2>
              <p className="text-gray-600">See who's dominating the coding arena!</p>
            </div>
          </div>
        );
      
      case 'auth':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full max-w-md px-4">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  Welcome to CodeRiot
                </h1>
                <p className="text-gray-600 text-lg">Your coding journey starts here</p>
              </div>

              {/* Auth Container */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setAuthTab('login')}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                      authTab === 'login'
                        ? 'bg-white text-gray-800 border-b-2 border-gray-800'
                        : 'text-gray-600 hover:text-gray-800 bg-gray-50'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthTab('register')}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                      authTab === 'register'
                        ? 'bg-white text-gray-800 border-b-2 border-gray-800'
                        : 'text-gray-600 hover:text-gray-800 bg-gray-50'
                    }`}
                  >
                    Register
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                  {authTab === 'login' && (
                    <UserLogin onToast={showToast} onLogin={handleLogin} />
                  )}
                  {authTab === 'register' && (
                    <UserRegister onToast={showToast} />
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-8 text-gray-500 text-sm">
                <p>© 2025 CodeRiot. Ready to code, ready to riot!</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return <Home onGetStarted={handleGetStarted} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast}
        />
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