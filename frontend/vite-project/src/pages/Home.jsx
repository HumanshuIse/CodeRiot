// src/pages/Home.jsx
"use client";

import { useState, useEffect } from "react";
import { Code, Trophy, Sword, Timer, Target, ArrowRight, Play, Star, Github, Zap, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home({ onGetStarted }) {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const backendUrl = import.meta.env.VITE_API_URL;
  const words = ["CodeRiot", "Battle", "Compete", "Conquer", "Code"];
  const currentWord = words[currentIndex];
  const [stats, setStats] = useState([
    { number: "-", label: "ACTIVE CODERS" },
    { number: "-", label: "BATTLES FOUGHT" },
    { number: "-", label: "DSA PROBLEMS" },
    { number: "24/7", label: "LIVE MATCHES" },
  ]);

  // const formatStatNumber = (num) => {
  //   if (num >= 1000) {
  //     return `${Math.floor(num / 1000)}K+`;
  //   }
  //   return num.toString();
  // };

  useEffect(()=>{
    const fetchStats = async () => {
      try{
      const response = await axios.get(`${backendUrl}/api/stats/`);
      const stat_data = response.data;
      console.log("Fetched stats:",stat_data);
      setStats([
        { number: (stat_data.active_coders), label: "ACTIVE CODERS" },
        { number: (stat_data.battles_fought), label: "BATTLES FOUGHT" },
        { number: (stat_data.dsa_problems), label: "DSA PROBLEMS" },
        { number: "24/7", label: "LIVE MATCHES" }, // This can remain static
      ]);
    }catch(error){
      console.error("Error fetching stats:",error);
    }
    };
    fetchStats();
  },[])

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!isDeleting && displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayText === "") {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        } else if (isDeleting) {
          setDisplayText(currentWord.substring(0, displayText.length - 1));
        } else {
          setDisplayText(currentWord.substring(0, displayText.length + 1));
        }
      },
      isDeleting ? 100 : 150,
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWord, currentIndex]);

  const features = [
    {
      icon: <Sword className="w-5 h-5" />,
      title: "REAL-TIME BATTLES",
      description: "Challenge developers worldwide in live coding duels with instant feedback.",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: <Timer className="w-5 h-5" />,
      title: "TIMED CHALLENGES",
      description: "Race against the clock to solve complex DSA problems and climb ranks.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "SMART MATCHING",
      description: "Get paired with opponents of similar skill using queue-based matchmaking.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "GLOBAL RANKINGS",
      description: "Track progress and compete for the top spot on dynamic leaderboards.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const FloatingCodeBlock = ({ children, style = {}, delay = 0, size = "text-xl", textColor = "text-green-400", borderColor = "border-green-500/30", bgColor = "bg-gray-800/30" }) => (
    <div
      className={`absolute ${bgColor} backdrop-blur-sm border ${borderColor} rounded-lg p-2 ${size} font-pixel ${textColor} opacity-50 animate-float`}
      style={{
        animationDelay: `${delay}s`,
        ...style,
        transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
      }}
    >
      {children}
    </div>
  );

  const floatingElements = [
    { text: 'QUICKSORT()', top: '10%', left: '10%', size: 'text-2xl', textColor: 'text-cyan-400', delay: 0.1 },
    { text: 'WHILE(TRUE)', top: '20%', right: '15%', size: 'text-xl', textColor: 'text-blue-400', delay: 0.7 },
    { text: 'O(LOG N)', top: '30%', left: '5%', size: 'text-3xl', textColor: 'text-purple-400', delay: 1.3 },
    { text: 'DIJKSTRA', top: '40%', right: '10%', size: 'text-2xl', textColor: 'text-green-400', delay: 1.9 },
    { text: 'BINARY TREE', top: '50%', left: '20%', size: 'text-xl', textColor: 'text-yellow-400', delay: 2.5 },
    { text: 'BFS', top: '60%', right: '25%', size: 'text-xl', textColor: 'text-red-400', delay: 3.1 },
    { text: '<>', top: '15%', right: '5%', size: 'text-4xl', textColor: 'text-cyan-300', delay: 0.3 },
    { text: '{}', top: '25%', left: '25%', size: 'text-3xl', textColor: 'text-blue-300', delay: 0.9 },
    { text: '//', top: '35%', right: '20%', size: 'text-2xl', textColor: 'text-purple-300', delay: 1.5 },
    { text: ';', top: '45%', left: '15%', size: 'text-4xl', textColor: 'text-green-300', delay: 2.1 },
    { text: '()', top: '55%', right: '30%', size: 'text-3xl', textColor: 'text-yellow-300', delay: 2.7 },
    { text: '!', top: '65%', left: '5%', size: 'text-4xl', textColor: 'text-red-300', delay: 3.3 },
    { text: 'const', top: '75%', right: '10%', size: 'text-xl', textColor: 'text-indigo-300', delay: 3.9 },
    { text: 'func', top: '85%', left: '30%', size: 'text-2xl', textColor: 'text-pink-300', delay: 4.5 },
    { text: '#', top: '70%', right: '40%', size: 'text-4xl', textColor: 'text-orange-300', delay: 5.1 },
    { text: '=>', top: '80%', left: '45%', size: 'text-3xl', textColor: 'text-teal-300', delay: 5.7 },
    { text: 'var', top: '5%', left: '50%', size: 'text-xl', textColor: 'text-gray-400', delay: 6.0 },
    { text: 'null', top: '90%', right: '50%', size: 'text-xl', textColor: 'text-gray-400', delay: 6.3 },
  ];


  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background with 3D Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

        {/* Floating Programming Elements */}
        {floatingElements.map((element, index) => (
          <FloatingCodeBlock
            key={index}
            style={{ top: element.top, left: element.left, right: element.right }}
            delay={element.delay}
            size={element.size}
            textColor={element.textColor}
          >
            {element.text}
          </FloatingCodeBlock>
        ))}

        {/* Retro Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-pixel mb-8 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent text-shadow-neon">
                {displayText}
              </span>
              <span className="animate-pulse text-cyan-400">|</span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed font-tech">
              WHERE ALGORITHMS MEET ADRENALINE
              <br className="hidden md:block" />
              BATTLE DEVS IN REAL-TIME
              <br className="hidden md:block" />
              DOMINATE THE DIGITAL ARENA
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              onClick = {()=>navigate('/matchmaking')}
              size="lg"
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 font-tech font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-4 h-4 mr-2" />
              ENTER ARENA
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-600 text-white hover:bg-white hover:text-black px-8 py-4 font-tech font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-transparent"
            >
              <Github className="w-4 h-4 mr-2" />
              WATCH DEMO
            </Button>
          </div>

          {/* 3D Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="relative group">
                <div className="bg-gray-900/50 backdrop-blur-sm pixel-border p-4 text-center transform hover:scale-105 transition-all duration-300 hover:border-cyan-500/50 animate-glow">
                  <div className="text-2xl md:text-3xl font-pixel bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 font-tech text-xs">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-16 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-tech font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-shadow-neon">
              BATTLE FEATURES
            </h2>
            <p className="text-sm text-gray-400 max-w-3xl mx-auto font-tech leading-relaxed">
              ULTIMATE CODING COMPETITION PLATFORM
              <br />
              WITH CUTTING-EDGE FEATURES
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-cyan-500/50 transition-all duration-300 group hover:scale-105 relative overflow-hidden rounded-none pixel-border"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-4 relative z-10">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 pixel-border`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-sm font-tech font-semibold mb-3 text-white leading-tight">{feature.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Arena Preview Section */}
      <section id="arena" className="relative z-10 py-16 px-4 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-tech font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-shadow-neon">
              THE ARENA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 pixel-border animate-glow">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-tech font-semibold mb-3">JOIN BATTLE</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                GET MATCHED WITH OPPONENTS
                <br />
                USING SMART ALGORITHMS
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 pixel-border animate-glow">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-tech font-semibold mb-3">CODE & COMPETE</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                SOLVE DSA PROBLEMS
                <br />
                IN REAL-TIME BATTLES
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 pixel-border animate-glow">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-tech font-semibold mb-3">CLAIM VICTORY</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                EARN POINTS AND RISE
                <br />
                THROUGH THE RANKINGS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-tech font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent text-shadow-neon">
            READY TO BATTLE?
          </h2>
          <p className="text-sm text-gray-400 mb-8 max-w-2xl mx-auto font-tech leading-relaxed">
            JOIN THOUSANDS OF DEVELOPERS
            <br />
            IN THE ULTIMATE CODING ARENA
            <br />
            YOUR VICTORY AWAITS
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-10 py-5 font-tech font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            ENTER THE ARENA
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center pixel-border animate-glow">
                <Code className="w-4 h-4" />
              </div>
              <span className="text-lg font-pixel bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                CodeRiot
              </span>
            </div>
            <div className="flex items-center space-x-4 text-gray-400 font-tech text-xs">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                PRIVACY
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                TERMS
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                SUPPORT
              </a>
              <div className="flex items-center space-x-2">
                <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                <span>FASTAPI + REACT</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-600 text-xs">
            <p>&copy; 2025 CodeRiot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}