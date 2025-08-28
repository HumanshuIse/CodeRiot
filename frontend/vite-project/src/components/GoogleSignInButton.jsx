// src/components/GoogleSignInButton.jsx
import React from 'react';

// A simple Google icon SVG to use in the button
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.94C34.353 4.909 29.493 2.5 24 2.5C11.936 2.5 2.5 11.936 2.5 24s9.436 21.5 21.5 21.5c11.953 0 21.227-9.523 21.489-21.233c.023-.192.038-.389.038-.588c0-.621-.054-1.229-.15-1.832z" />
    <path fill="#FF3D00" d="M6.306 14.691c-2.221 4.316-2.221 9.31 0 13.626l-3.39 3.39c-3.447-6.59-3.447-14.47 0-21.06l3.39 3.39z" />
    <path fill="#4CAF50" d="M24 45.5c5.493 0 10.353-2.409 13.802-6.56l-4.998-4.998c-2.185 1.832-4.96 2.922-8.804 2.922c-5.223 0-9.66-3.343-11.303-8H2.5v8.023C6.953 41.091 14.993 45.5 24 45.5z" />
    <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.237 4.14-4.285 5.443l4.998 4.998C42.008 34.61 45.5 28.92 45.5 24c0-1.922-.22-3.81-.623-5.631l-1.266-1.286z" />
  </svg>
);

const GoogleSignInButton = () => {
  const backendUrl = import.meta.env.VITE_API_URL;

  const handleGoogleSignIn = () => {
    // Redirect the user to the backend's Google login endpoint
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center bg-white text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 pixel-border-light"
    >
      <GoogleIcon />
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;