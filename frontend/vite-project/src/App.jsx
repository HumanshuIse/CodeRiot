// // src/App.jsx
// import React, { useState, useEffect } from 'react';
// import UserLogin from './components/UserLogin';
// import UserRegister from './components/UserRegister';
// import Home from './pages/Home'; // Your CodeRiotLanding
// import CodeEditor from './components/CodeEditor';
// import Navbar from './components/Navbar';
// import Toast from './components/Toast';
// import UserProfile from './pages/UserProfile'; // ✅ NEW: Import UserProfile
// import ProblemSubmissionForm from './components/ProblemSubmissionForm'; // ✅ NEW: Import ProblemSubmissionForm
// import axios from 'axios';

// const App = () => {
//   const [activeTab, setActiveTab] = useState('home');
//   const [authTab, setAuthTab] = useState('login');
//   const [toastInfo, setToastInfo] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState('');

//   const showToast = (message, type) => {
//     setToastInfo({ message, type });
//   };

//   const hideToast = () => {
//     setToastInfo(null);
//   };

//   const handleLogin = (userData) => {
//     setIsLoggedIn(true);
//     setUsername(userData.username);
//     // Optionally fetch full profile data here if not done in UserLogin.
//     setActiveTab('user-profile'); // ✅ Redirect to user profile after login
//     showToast('Login successful!', 'success');
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUsername('');
//     localStorage.removeItem('token'); // Clear token on logout
//     setActiveTab('home');
//     showToast('Logged out successfully', 'success');
//   };

//   const handleGetStarted = () => {
//     setActiveTab('auth');
//     setAuthTab('login');
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'home':
//         return <Home onGetStarted={handleGetStarted} setActiveTab={setActiveTab} />; // Pass setActiveTab
      
//       case 'editor':
//         return <CodeEditor />;
      
//       case 'matchmaking':
//         return (
//           <div className="min-h-screen bg-black flex items-center justify-center">
//             <div className="text-center">
//               <h2 className="text-3xl font-pixel text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-shadow-neon">Matchmaking</h2>
//               <p className="text-gray-300 font-tech">Find your coding opponent and start battling!</p>
//             </div>
//           </div>
//         );
      
//       case 'leaderboard':
//         return (
//           <div className="min-h-screen bg-black flex items-center justify-center">
//             <div className="text-center">
//               <h2 className="text-3xl font-pixel text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-shadow-neon">Leaderboard</h2>
//               <p className="text-gray-300 font-tech">See who's dominating the coding arena!</p>
//             </div>
//           </div>
//         );
      
//       case 'user-profile': // ✅ NEW: User Profile Page Route
//         if (!isLoggedIn) {
//           showToast("Please log in to view your profile.", "error");
//           setActiveTab('auth'); // Redirect to auth if not logged in
//           return null; // Don't render until redirected
//         }
//         return <UserProfile onToast={showToast} setActiveTab={setActiveTab} />; // Pass setActiveTab

//       case 'submit-problem': // ✅ NEW: Problem Submission Form (Protected)
//         if (!isLoggedIn) {
//           showToast("Please log in to submit a problem.", "error");
//           setActiveTab('auth'); // Redirect to auth if not logged in
//           return null; // Don't render until redirected
//         }
//         return <ProblemSubmissionForm onToast={showToast} />;
      
//       case 'auth':
//         return (
//           <div className="min-h-screen bg-black flex items-center justify-center py-8"> 
//             <div className="w-full max-w-md px-4">
//               <div className="text-center mb-8">
//                 <h1 className="text-4xl font-pixel text-white mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-shadow-neon">
//                   Welcome to CodeRiot
//                 </h1>
//                 <p className="text-gray-300 text-lg font-tech">Your coding journey starts here</p>
//               </div>

//               <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-gray-700 pixel-border animate-glow-slow"> {/* Added consistent styling */}
//                 <div className="flex border-b border-gray-700">
//                   <button
//                     onClick={() => setAuthTab('login')}
//                     className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 font-tech ${
//                       authTab === 'login'
//                         ? 'bg-gray-800 text-white border-b-2 border-blue-500'
//                         : 'text-gray-400 hover:text-white bg-gray-700'
//                     }`}
//                   >
//                     Login
//                   </button>
//                   <button
//                     onClick={() => setAuthTab('register')}
//                     className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 font-tech ${
//                       authTab === 'register'
//                         ? 'bg-gray-800 text-white border-b-2 border-blue-500'
//                         : 'text-gray-400 hover:text-white bg-gray-700'
//                     }`}
//                   >
//                     Register
//                   </button>
//                 </div>

//                 <div className="p-8">
//                   {authTab === 'login' && (
//                     <UserLogin onToast={showToast} onLogin={handleLogin} />
//                   )}
//                   {authTab === 'register' && (
//                     <UserRegister onToast={showToast} />
//                   )}
//                 </div>
//               </div>

//               <div className="text-center mt-8 text-gray-500 text-sm font-tech">
//                 <p>© {new Date().getFullYear()} CodeRiot. All rights reserved.</p>
//               </div>
//             </div>
//           </div>
//         );
      
//       default:
//         return <Home onGetStarted={handleGetStarted} setActiveTab={setActiveTab} />;
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsLoggedIn(true);
//       // Fetch username if token exists but username state is empty (e.g., page refresh)
//       if (!username) {
//         axios.get('http://localhost:8000/api/v1/profile', {
//           headers: { 'Authorization': `Bearer ${token}` }
//         })
//         .then(response => {
//           setUsername(response.data.username);
//         })
//         .catch(error => {
//           console.error("Failed to fetch user profile on app load:", error);
//           localStorage.removeItem('token'); // Clear invalid token
//           setIsLoggedIn(false);
//           setUsername('');
//           showToast("Your session expired. Please log in again.", "error");
//         });
//       }
//     } else {
//       setIsLoggedIn(false);
//       setUsername('');
//     }
//   }, [username]); // Rerun if username changes to ensure consistency

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* GLOBAL FONT STYLES - IMPORTANT */}
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
//         .font-tech { font-family: 'Rajdhani', sans-serif; }
//         @font-face {
//           font-family: 'PressStart2P';
//           src: url('/src/assets/fonts/PressStart2P.ttf') format('truetype');
//           font-weight: normal;
//           font-style: normal;
//           font-display: swap;
//         }
//         .font-pixel { font-family: 'PressStart2P', 'Courier New', monospace; }
        
//         /* Global styles */
//         .pixel-border { border-image: linear-gradient(45deg, #00ffff, #ff00ff) 1; border-style: solid; border-width: 2px; }
//         .animate-glow { animation: glow 2s ease-in-out infinite; }
//         @keyframes glow { 0%, 100% { box-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff; } 50% { box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; } }
//         .text-shadow-neon {
//           text-shadow:
//             0 0 5px currentColor,
//             0 0 10px currentColor,
//             0 0 15px currentColor,
//             0 0 20px currentColor;
//         }
//         .animate-glow-slow {
//           animation: glow 3s ease-in-out infinite;
//         }
//       `}</style>
      
//       {/* Toast Notification */}
//       {toastInfo && (
//         <div className="fixed top-4 right-4 z-50">
//           <Toast 
//             message={toastInfo.message} 
//             type={toastInfo.type} 
//             onClose={hideToast}
//           />
//         </div>
//       )}
      
//       {/* Navbar */}
//       <Navbar 
//         activeTab={activeTab} 
//         setActiveTab={setActiveTab}
//         isLoggedIn={isLoggedIn}
//         username={username}
//         onLogout={handleLogout}
//       />

//       {/* Main Content */}
//       {renderContent()}
//     </div>
//   );
// };

// export default App;

// src/App.jsx
import React, { useState, useEffect } from 'react';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import Home from './pages/Home';
import CodeEditor from './components/CodeEditor';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import UserProfile from './pages/UserProfile';
import ProblemSubmissionForm from './components/ProblemSubmissionForm';
import axios from 'axios';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [authTab, setAuthTab] = useState('login');
  const [toastInfo, setToastInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const showToast = (message, type) => {
    setToastInfo({ message, type });
  };

  const hideToast = () => {
    setToastInfo(null);
  };

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUsername(userData.username);
    setActiveTab('user-profile');
    showToast('Login successful!', 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('token');
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!username) {
        axios.get('http://localhost:8000/api/v1/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
          setIsLoggedIn(true);
          setUsername(response.data.username);
        })
        .catch(error => {
          console.error("Failed to fetch user profile on app load:", error);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setUsername('');
          showToast("Your session expired. Please log in again.", "error");
        });
      }
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  }, [username]);

  return (
    <div className="min-h-screen bg-black text-white">
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
      
      {toastInfo && (
        <div className="fixed top-4 right-4 z-50">
          <Toast message={toastInfo.message} type={toastInfo.type} onClose={hideToast} />
        </div>
      )}
      
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />

      {renderContent()}
    </div>
  );
};

export default App;