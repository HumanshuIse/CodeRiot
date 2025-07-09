import React, { useState } from 'react';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import Toast from './components/toast';

const App = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast}
        />
      )}

      {/* Header */}
      <div className="text-center pt-8 pb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome to CodeRiot
        </h1>
        <p className="text-gray-600 text-lg">Your coding journey starts here</p>
      </div>

      {/* Main Container */}
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-white text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-600 hover:text-gray-800 bg-gray-50'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                activeTab === 'register'
                  ? 'bg-white text-gray-800 border-b-2 border-gray-800'
                  : 'text-gray-600 hover:text-gray-800 bg-gray-50'
              }`}
            >
              Register
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'login' ? (
              <UserLogin onToast={showToast} />
            ) : (
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
};

export default App;