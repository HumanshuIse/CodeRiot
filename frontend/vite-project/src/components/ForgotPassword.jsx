// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = ({ onBackToLogin, onToast }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const backendUrl = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/api/auth/forgot-password`, { email });
            onToast(response.data.message, 'success');
            onBackToLogin(); // Go back to the login view after successful submission
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'An error occurred. Please try again.';
            onToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 font-tech text-white animate-fade-in">
            <div className="text-center">
                 <h2 className="text-2xl font-bold">Forgot Password</h2>
                 <p className="text-gray-400 mt-2">We'll send a recovery link to your email.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                            placeholder="your.email@example.com"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 pixel-border"
                >
                    {isLoading ? 'Sending...' : 'Send Recovery Link'}
                </button>
            </form>
             <button
                onClick={onBackToLogin}
                className="w-full flex items-center justify-center text-sm text-cyan-400 hover:text-cyan-300"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
            </button>
        </div>
    );
};

export default ForgotPassword;