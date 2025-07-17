// import React, { useState } from 'react';
// import { User, Lock, Eye, EyeOff } from 'lucide-react';
// import axios from 'axios';

// const UserLogin = ({ onToast }) => {
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
//       const response = await axios.post('http://127.0.0.1:8000/api/login/', {
//         username: form.username,
//         password: form.password
//       });
      
//       if (response.status === 200) {
//         onToast('Login successful! Welcome back!', 'success');
//         setForm({ username: '', password: '' });
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       onToast('Login failed. Please check your credentials and try again.', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="space-y-4">
//         <div>
//           <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
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
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200"
//               placeholder="Enter your username"
//             />
//           </div>
//         </div>

//         <div>
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
//               className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200"
//               placeholder="Enter your password"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
//         className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
//     </div>
//   );
// };

// export default UserLogin;
import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const UserLogin = ({ onToast, onLogin }) => { // Added onLogin prop for callback to App.jsx
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ensure the form doesn't reload the page

    if (!form.username || !form.password) {
      onToast('Please enter both username and password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username: form.username,
        password: form.password
      });

      if (response.status === 200) {
        onToast('Login successful! Welcome back!', 'success');
        setForm({ username: '', password: '' });
        // Call the onLogin callback from App.jsx with user data
        if (onLogin) {
          onLogin({ username: form.username }); // Pass relevant user data
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      // More specific error handling from backend response if available
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials and try again.';
      onToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Updated overall styling for dark theme consistency
    <form onSubmit={handleSubmit} className="space-y-6 font-tech text-white"> {/* Added font-tech and text-white */}
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1"> {/* Adjusted text color */}
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              // Updated input styles for dark theme
              className="w-full pl-10 pr-4 py-3 border border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-white"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1"> {/* Adjusted text color */}
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              // Updated input styles for dark theme
              className="w-full pl-10 pr-12 py-3 border border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-white"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400" // Adjusted hover color
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        onClick={handleSubmit} // This is already attached to form's onSubmit, keeping for clarity
        // Applied gradient, pixel-border, and glow effects
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pixel-border animate-glow"
      >
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