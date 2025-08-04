// src/components/UserRegister.jsx
import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const UserRegister = ({ onToast, onLoginSuccess }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      onToast('Passwords do not match', 'error');
      return;
    }
    
    if (form.password.length < 6) {
      onToast('Password must be at least 6 characters long', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      
      if (response.status === 200 && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        onLoginSuccess(response.data.access_token, navigate); // Pass navigate to onLoginSuccess
      }
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
      onToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-tech text-white">
      <div className="space-y-4">
        {/* Username Input */}
        <div>
          <label htmlFor="reg-username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" id="reg-username" name="username" value={form.username} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-white" placeholder="Choose a username" />
          </div>
        </div>
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-white" placeholder="Enter your email" />
          </div>
        </div>
        {/* Password Input */}
        <div>
          <label htmlFor="reg-password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type={showPassword ? 'text' : 'password'} id="reg-password" name="password" value={form.password} onChange={handleChange} required className="w-full pl-10 pr-12 py-3 border border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-white" placeholder="Create a password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required className="w-full pl-10 pr-12 py-3 border border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-white" placeholder="Confirm your password" />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400">
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pixel-border animate-glow">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Creating account...
          </div>
        ) : (
          'Register'
        )}
      </button>
    </form>
  );
};

export default UserRegister;
