// // src/components/UserLogin.jsx
// import React, { useState } from 'react';
// import { User, Lock, Eye, EyeOff } from 'lucide-react';
// import axios from 'axios';

// const UserLogin = ({ onToast, onLogin }) => { // Added onLogin prop
//   const [form, setForm] = useState({
//     username: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.username || !form.password) {
//       onToast('Please enter both username and password', 'error');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.post('http://127.0.0.1:8000/api/login', { // ✅ Check API endpoint path
//         username: form.username,
//         password: form.password
//       });

//       if (response.status === 200) {
//         localStorage.setItem('token', response.data.access_token); // Save token
//         onToast('Login successful! Welcome back!', 'success');
//         setForm({ username: '', password: '' });
//         if (onLogin) {
//           // Pass the username to the onLogin callback
//           onLogin({ username: form.username });
//         }
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials and try again.';
//       onToast(errorMessage, 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6 font-tech text-white">
//       <div className="space-y-4">
//         <div>
//           <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
//             Username
//           </label>
//           <div className="relative">
//             <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={form.username}
//               onChange={handleChange}
//               required
//               className="w-full pl-10 pr-4 py-3 border border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-white"
//               placeholder="Enter your username"
//             />
//           </div>
//         </div>

//         <div>
//           <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
//             Password
//           </label>
//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               required
//               className="w-full pl-10 pr-12 py-3 border border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-white"
//               placeholder="Enter your password"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
//             >
//               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={isLoading}
//         onClick={handleSubmit}
//         className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pixel-border animate-glow"
//       >
//         {isLoading ? (
//           <div className="flex items-center justify-center">
//             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//             Logging in...
//           </div>
//         ) : (
//           'Login'
//         )}
//       </button>
//     </form>
//   );
// };

// export default UserLogin;

// src/components/UserLogin.jsx
import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const UserLogin = ({ onToast, onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      onToast('Please enter both username and password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        username: form.username,
        password: form.password
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.access_token);
        setForm({ username: '', password: '' });
        
        if (onLogin) {
          onLogin({ username: form.username });
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      onToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-tech text-white">
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" id="username" name="username" value={form.username} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-white" placeholder="Enter your username" />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={form.password} onChange={handleChange} required className="w-full pl-10 pr-12 py-3 border border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-white" placeholder="Enter your password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pixel-border animate-glow">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Logging in...
          </div>
        ) : (
          'Login'
        )}
      </button>
    </form>
  );
};

export default UserLogin;