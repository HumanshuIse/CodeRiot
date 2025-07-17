
// import React, { useState } from 'react';
// import UserLogin from './components/UserLogin';
// import UserRegister from './components/UserRegister';
// import Home from './pages/Home';
// import CodeEditor from './components/CodeEditor'; // Import the CodeEditor component
// import Navbar from './components/Navbar';
// import Toast from './components/Toast'; // Correct import path for your Toast.jsx

// const App = () => {
//   const [activeTab, setActiveTab] = useState('home');
//   const [authTab, setAuthTab] = useState('login'); // For switching between login/register
//   const [toastInfo, setToastInfo] = useState(null); // Renamed from 'toast' to 'toastInfo' for clarity
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState('');

//   // Function to show a toast
//   const showToast = (message, type) => {
//     setToastInfo({ message, type });
//   };

//   // Function to hide the toast
//   const hideToast = () => {
//     setToastInfo(null);
//   };

//   const handleLogin = (userData) => {
//     setIsLoggedIn(true);
//     setUsername(userData.username);
//     setActiveTab('home');
//     showToast('Login successful!', 'success'); // Trigger toast on successful login
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUsername('');
//     setActiveTab('home');
//     showToast('Logged out successfully', 'success'); // Trigger toast on logout
//   };

//   const handleGetStarted = () => {
//     setActiveTab('auth');
//     setAuthTab('login');
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'home':
//         return <Home onGetStarted={handleGetStarted} setActiveTab={setActiveTab} />;
      
//       case 'editor':
//         return <CodeEditor />;
      
//       case 'matchmaking':
//         return (
//           <div className="min-h-screen bg-gray-900 flex items-center justify-center"> {/* Changed background */}
//             <div className="text-center">
//               <h2 className="text-3xl font-bold text-white mb-4">Matchmaking</h2> {/* Changed text color */}
//               <p className="text-gray-300">Find your coding opponent and start battling!</p> {/* Changed text color */}
//             </div>
//           </div>
//         );
      
//       case 'leaderboard':
//         return (
//           <div className="min-h-screen bg-gray-900 flex items-center justify-center"> {/* Changed background */}
//             <div className="text-center">
//               <h2 className="text-3xl font-bold text-white mb-4">Leaderboard</h2> {/* Changed text color */}
//               <p className="text-gray-300">See who's dominating the coding arena!</p> {/* Changed text color */}
//             </div>
//           </div>
//         );
      
//       case 'auth':
//         return (
//           // Adjusted background color for auth section to match overall theme better
//           <div className="min-h-screen bg-gray-900 flex items-center justify-center py-8"> 
//             <div className="w-full max-w-md px-4">
//               {/* Header */}
//               <div className="text-center mb-8">
//                 <h1 className="text-4xl font-bold text-white mb-2"> {/* Changed text color */}
//                   Welcome to CodeRiot
//                 </h1>
//                 <p className="text-gray-300 text-lg">Your coding journey starts here</p> {/* Changed text color */}
//               </div>

//               {/* Auth Container */}
//               <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700"> {/* Adjusted background and border */}
//                 {/* Tab Navigation */}
//                 <div className="flex border-b border-gray-700"> {/* Adjusted border */}
//                   <button
//                     onClick={() => setAuthTab('login')}
//                     className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
//                       authTab === 'login'
//                         ? 'bg-gray-800 text-white border-b-2 border-blue-500' // Adjusted active tab styles
//                         : 'text-gray-400 hover:text-white bg-gray-700' // Adjusted inactive tab styles
//                     }`}
//                   >
//                     Login
//                   </button>
//                   <button
//                     onClick={() => setAuthTab('register')}
//                     className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
//                       authTab === 'register'
//                         ? 'bg-gray-800 text-white border-b-2 border-blue-500' // Adjusted active tab styles
//                         : 'text-gray-400 hover:text-white bg-gray-700' // Adjusted inactive tab styles
//                     }`}
//                   >
//                     Register
//                   </button>
//                 </div>

//                 {/* Tab Content */}
//                 <div className="p-8">
//                   {authTab === 'login' && (
//                     // Pass showToast directly to UserLogin
//                     <UserLogin onToast={showToast} onLogin={handleLogin} />
//                   )}
//                   {authTab === 'register' && (
//                     // Pass showToast directly to UserRegister
//                     <UserRegister onToast={showToast} />
//                   )}
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="text-center mt-8 text-gray-500 text-sm">
//                 <p>© {new Date().getFullYear()} CodeRiot. Ready to code, ready to riot!</p> {/* Dynamic year */}
//               </div>
//             </div>
//           </div>
//         );
      
//       default:
//         return <Home onGetStarted={handleGetStarted} setActiveTab={setActiveTab} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white"> {/* Set global background/text */}
//       {/* Toast Notification */}
//       {toastInfo && (
//         <div className="fixed top-4 right-4 z-50"> {/* Container for the toast to control its position */}
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
import React, { useState } from 'react';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import Home from './pages/Home';
import CodeEditor from './components/CodeEditor';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

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
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Matchmaking</h2>
              <p className="text-gray-300">Find your coding opponent and start battling!</p>
            </div>
          </div>
        );
      
      case 'leaderboard':
        return (
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Leaderboard</h2>
              <p className="text-gray-300">See who's dominating the coding arena!</p>
            </div>
          </div>
        );
      
      case 'auth':
        return (
          <div className="min-h-screen bg-gray-900 flex items-center justify-center py-8"> 
            <div className="w-full max-w-md px-4">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2 font-pixel"> {/* ADD font-pixel HERE */}
                  Welcome to CodeRiot
                </h1>
                <p className="text-gray-300 text-lg font-tech">Your coding journey starts here</p> {/* ADD font-tech HERE */}
              </div>

              {/* Auth Container */}
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-700">
                  <button
                    onClick={() => setAuthTab('login')}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                      authTab === 'login'
                        ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                        : 'text-gray-400 hover:text-white bg-gray-700'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthTab('register')}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                      authTab === 'register'
                        ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                        : 'text-gray-400 hover:text-white bg-gray-700'
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
                <p>© {new Date().getFullYear()} CodeRiot. All rights reserved.</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return <Home onGetStarted={handleGetStarted} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* GLOBAL FONT STYLES - IMPORTANT */}
      {/* These styles are necessary for font-pixel and font-tech to work in App.jsx */}
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
        /* Add other global styles here that were in Home.jsx if needed throughout the app */
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
      `}</style>
      
      {/* Toast Notification */}
      {toastInfo && (
        <div className="fixed top-4 right-4 z-50">
          <Toast 
            message={toastInfo.message} 
            type={toastInfo.type} 
            onClose={hideToast}
          />
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