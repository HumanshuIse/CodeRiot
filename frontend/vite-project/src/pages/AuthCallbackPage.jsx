// src/pages/AuthCallbackPage.jsx
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthCallbackPage = ({ onToast, onLoginSuccess }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // If a token is found, store it and call the success handler
      localStorage.setItem('token', token);
      onToast('Successfully logged in with Google!', 'success');
      // onLoginSuccess will typically fetch user data and then navigate
      onLoginSuccess(token, navigate);
    } else {
      // If no token is found, something went wrong
      onToast('Google authentication failed. Please try again.', 'error');
      navigate('/auth'); // Redirect back to the main auth page
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // The empty dependency array ensures this runs only once on mount

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center font-tech">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-2xl">Finalizing your login...</h1>
        <p className="text-gray-400">Please wait while we securely log you in.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;