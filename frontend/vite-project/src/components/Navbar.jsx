// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Menu, X, Code, Users, Trophy, User, LogOut, Terminal, Home as HomeIcon } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, isLoggedIn, username, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'editor', label: 'Code Editor', icon: Terminal },
    { id: 'matchmaking', label: 'Matchmaking', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-40 shadow-lg font-tech">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-shrink-0">
            <button onClick={() => handleNavClick('home')} className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center rounded-lg pixel-border animate-glow">
                <Code className="w-4 h-4" />
              </div>
              <span className="text-xl font-pixel bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">CodeRiot</span>
            </button>
          </div>
          <div className="hidden md:flex flex-grow items-center justify-center space-x-6">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => handleNavClick(id)} className={`flex items-center space-x-1 px-4 py-2 rounded-xl transition-all duration-200 text-xs font-semibold uppercase ${ activeTab === id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' }`}>
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center flex-shrink-0">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button onClick={() => handleNavClick('user-profile')} className="flex items-center space-x-2 text-gray-300 text-sm hover:text-cyan-400 transition-colors">
                  <User className="w-4 h-4" />
                  <span>{username}</span>
                </button>
                <button onClick={onLogout} className="flex items-center space-x-1 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-200 text-sm">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button onClick={() => handleNavClick('auth')} className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg font-semibold uppercase text-sm">
                Get Started
              </button>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white p-2">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => handleNavClick(id)} className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg transition-all duration-200 ${ activeTab === id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700' }`}>
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
            <div className="border-t border-gray-700 pt-2 mt-2">
              {isLoggedIn ? (
                <div className="space-y-1">
                  <button onClick={() => handleNavClick('user-profile')} className="flex items-center space-x-2 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200">
                    <User className="w-4 h-4" />
                    <span>{username}</span>
                  </button>
                  <button onClick={onLogout} className="flex items-center space-x-2 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button onClick={() => handleNavClick('auth')} className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200">
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
