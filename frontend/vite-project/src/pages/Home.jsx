import React, { useState, useEffect } from 'react';
import { Code, Zap, Users, Trophy } from 'lucide-react';

const Home = ({ onGetStarted }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const words = ['CodeRiot', 'Compete', 'Create', 'Conquer'];
  const currentWord = words[currentIndex];

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === currentWord) {
        // Finished typing current word, start deleting after pause
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayText === '') {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
      } else if (isDeleting) {
        // Continue deleting
        setDisplayText(currentWord.substring(0, displayText.length - 1));
      } else {
        // Continue typing
        setDisplayText(currentWord.substring(0, displayText.length + 1));
      }
    }, isDeleting ? 100 : 150);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWord, currentIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-green-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-500 rounded-full opacity-10 animate-pulse delay-2000"></div>
        </div>

        {/* Main Content */}
        <div className="text-center z-10">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent">
              {displayText}
              <span className="animate-pulse">|</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Where code meets competition. Challenge developers worldwide,
              <br />
              sharpen your skills, and rise through the ranks.
            </p>
          </div>

          {/* Get Started Button */}
          <button
            onClick={onGetStarted}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          </button>
        </div>

        {/* Features Grid */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
            <div className="text-center">
              <Code className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <h3 className="font-semibold text-sm">Code Challenges</h3>
              <p className="text-xs text-gray-400">Solve problems, improve skills</p>
            </div>
            <div className="text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <h3 className="font-semibold text-sm">Real-time Battles</h3>
              <p className="text-xs text-gray-400">Compete with developers live</p>
            </div>
            <div className="text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <h3 className="font-semibold text-sm">Leaderboards</h3>
              <p className="text-xs text-gray-400">Track your progress & rank</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;