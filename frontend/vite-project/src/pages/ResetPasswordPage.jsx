// src/pages/ResetPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage = ({ showToast }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const token = searchParams.get('token');

    const backendUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!token) {
            showToast('Invalid or missing password reset token.', 'error');
            navigate('/auth');
        }
    }, [token, navigate, showToast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            showToast('Password must be at least 6 characters long.', 'error');
            return;
        }
        if (password !== confirmPassword) {
            showToast('Passwords do not match.', 'error');
            return;
        }
        setIsLoading(true);
        try {
            await axios.post(`${backendUrl}/api/auth/reset-password`, {
                token: token,
                new_password: password
            });
            showToast('Password has been reset successfully! You can now log in.', 'success');
            navigate('/auth');
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Failed to reset password. The link may have expired.';
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center py-8">
            <div className="w-full max-w-md px-4">
                <div className="bg-gray-900/70 p-8 space-y-6 rounded-lg shadow-xl border border-gray-700 pixel-border">
                    <h2 className="text-center text-2xl font-bold text-white font-tech">Create a New Password</h2>
                    <form onSubmit={handleSubmit} className="space-y-6 font-tech">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Enter new password"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                             <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 pixel-border">
                            {isLoading ? 'Resetting...' : 'Set New Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;