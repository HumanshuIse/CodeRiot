import { useState, useEffect } from "react";
import {
  Code,
  Trophy,
  Sword,
  Timer,
  Target,
  ArrowRight,
  Play,
  Star,
  Github,
  Zap,
  Users,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CodeRiotLanding({ onGetStarted }) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const words = ["CodeRiot", "Battle", "Compete", "Conquer", "Code"];
  const currentWord = words[currentIndex];

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
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
    }, isDeleting ? 100 : 150);
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
      description: "Get paired with opponents of similar skill using graph algorithms.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "GLOBAL RANKINGS",
      description: "Track progress and compete for the top spot on dynamic leaderboards.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const stats = [
    { number: "10K+", label: "ACTIVE CODERS" },
    { number: "50K+", label: "BATTLES FOUGHT" },
    { number: "500+", label: "DSA PROBLEMS" },
    { number: "24/7", label: "LIVE MATCHES" },
  ];

  const FloatingCodeBlock = ({ children, className = "", delay = 0 }) => (
    <div
      className={`absolute bg-gray-800/30 backdrop-blur-sm border border-green-500/30 rounded-lg p-2 text-xs font-pixel text-green-400 animate-float ${className}`}
      style={{
        animationDelay: `${delay}s`,
        transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
      }}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        .font-tech {
          font-family: 'Rajdhani', sans-serif;
        }
        @font-face {
          font-family: 'PressStart2P';
          src: url('/fonts/PressStart2P.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        .font-pixel {
          font-family: 'PressStart2P', 'Courier New', monospace;
          line-height: 1.6;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(15px) rotate(-1deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff; }
          50% { box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 5s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .text-shadow-neon {
          text-shadow:
            0 0 5px currentColor,
            0 0 10px currentColor,
            0 0 15px currentColor,
            0 0 20px currentColor;
        }
        .pixel-border {
          border-image: linear-gradient(45deg, #00ffff, #ff00ff) 1;
          border-style: solid;
          border-width: 2px;
        }
      `}</style>

      {/* Background & Floating */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <FloatingCodeBlock className="top-16 left-8" delay={0}>QUICKSORT()</FloatingCodeBlock>
        <FloatingCodeBlock className="top-32 right-16 animate-float-reverse" delay={1}>WHILE(TRUE)</FloatingCodeBlock>
        <FloatingCodeBlock className="bottom-32 left-16" delay={2}>O(LOG N)</FloatingCodeBlock>
        <FloatingCodeBlock className="top-48 left-1/2 animate-float-reverse" delay={3}>DIJKSTRA</FloatingCodeBlock>
        <FloatingCodeBlock className="bottom-48 right-20" delay={4}>BINARY TREE</FloatingCodeBlock>
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 transform rotate-45 animate-float pixel-border" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 animate-float-reverse pixel-border" />
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-gradient-to-r from-red-500/20 to-orange-500/20 transform rotate-12 animate-float pixel-border" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between p-4 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center pixel-border animate-glow">
            <Code className="w-4 h-4" />
          </div>
          <span className="text-lg font-pixel bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">CodeRiot</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="font-tech text-gray-300 hover:text-cyan-400 text-xs">FEATURES</a>
          <a href="#arena" className="font-tech text-gray-300 hover:text-cyan-400 text-xs">ARENA</a>
          <a href="#leaderboard" className="font-tech text-gray-300 hover:text-cyan-400 text-xs">LEADERBOARD</a>
          <Button
            onClick={onGetStarted}
            variant="outline"
            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black font-tech text-xs rounded-xl"
          >
            SIGN IN
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-pixel mb-8 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent text-shadow-neon">{displayText}</span>
              <span className="animate-pulse text-cyan-400">|</span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-300 font-tech">WHERE ALGORITHMS MEET ADRENALINE<br />BATTLE DEVS IN REAL-TIME<br />DOMINATE THE DIGITAL ARENA</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button onClick={onGetStarted} size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-tech text-lg rounded-xl">
              <Play className="w-4 h-4 mr-2" />ENTER ARENA
            </Button>
            <Button variant="outline" size="lg" className="border-gray-600 text-white font-tech text-lg rounded-xl">
              <Github className="w-4 h-4 mr-2" />WATCH DEMO
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="relative group">
                <div className="bg-gray-900/50 pixel-border p-4 text-center hover:border-cyan-500/50 transition-all duration-300 animate-glow">
                  <div className="text-2xl md:text-3xl font-pixel bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">{stat.number}</div>
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
            <h2 className="text-3xl md:text-4xl font-tech font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">BATTLE FEATURES</h2>
            <p className="text-sm text-gray-400 font-tech">ULTIMATE CODING COMPETITION PLATFORM<br />WITH CUTTING-EDGE FEATURES</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-cyan-500/50 transition-all duration-300 pixel-border">
                <CardContent className="p-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 pixel-border`}>{feature.icon}</div>
                  <h3 className="text-sm font-tech font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-xs">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Arena Preview */}
      <section id="arena" className="relative z-10 py-16 px-4 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-tech font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">THE ARENA</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-4 pixel-border animate-glow flex items-center justify-center"><Users className="w-8 h-8" /></div>
              <h3 className="text-lg font-tech font-semibold">JOIN BATTLE</h3>
              <p className="text-gray-400 text-xs">GET MATCHED WITH OPPONENTS<br />USING SMART ALGORITHMS</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4 pixel-border animate-glow flex items-center justify-center"><Zap className="w-8 h-8" /></div>
              <h3 className="text-lg font-tech font-semibold">CODE & COMPETE</h3>
              <p className="text-gray-400 text-xs">SOLVE DSA PROBLEMS<br />IN REAL-TIME BATTLES</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mb-4 pixel-border animate-glow flex items-center justify-center"><Shield className="w-8 h-8" /></div>
              <h3 className="text-lg font-tech font-semibold">CLAIM VICTORY</h3>
              <p className="text-gray-400 text-xs">EARN POINTS AND RISE<br />THROUGH THE RANKINGS</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-16 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-tech font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">READY TO BATTLE?</h2>
          <p className="text-sm text-gray-400 mb-8 font-tech">JOIN THOUSANDS OF DEVELOPERS<br />IN THE ULTIMATE CODING ARENA<br />YOUR VICTORY AWAITS</p>
          <Button onClick={onGetStarted} size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-tech text-lg rounded-xl">
            ENTER THE ARENA <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center pixel-border animate-glow"><Code className="w-4 h-4" /></div>
            <span className="text-lg font-pixel bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">CodeRiot</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-400 font-tech text-xs">
            <a href="#" className="hover:text-cyan-400">PRIVACY</a>
            <a href="#" className="hover:text-cyan-400">TERMS</a>
            <a href="#" className="hover:text-cyan-400">SUPPORT</a>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>4.9/5</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
