// src/pages/Matchmaking.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Users, Swords, XCircle, Loader, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlayerCard = ({ username, isOpponent = false }) => (
    <div className="bg-gray-900/50 pixel-border p-6 text-center w-64 h-48 flex flex-col justify-center items-center animate-glow-slow border-cyan-500/50">
        <div className={`w-16 h-16 mb-4 flex items-center justify-center pixel-border ${isOpponent ? 'bg-red-500/20 border-red-500' : 'bg-blue-500/20 border-blue-500'}`}>
            {isOpponent ? <Zap className="w-8 h-8 text-red-400" /> : <Shield className="w-8 h-8 text-cyan-400" />}
        </div>
        <h3 className="font-pixel text-lg text-white truncate">{username}</h3>
        <p className="font-tech text-sm text-gray-400">{isOpponent ? 'Opponent' : 'You'}</p>
    </div>
);
const backendUrl = import.meta.env.VITE_API_URL;
const wsUrl = import.meta.env.VITE_WS_URL;

const Matchmaking = ({ userId, username, onToast, onMatchFound }) => {
    const [status, setStatus] = useState('idle');
    const [matchDetails, setMatchDetails] = useState(null);
    const [opponentUsername, setOpponentUsername] = useState('Opponent');
    const [countdown, setCountdown] = useState(5);
    
    const socketRef = useRef(null);
    const navigate = useNavigate();

    const fetchOpponentUsername = useCallback(async (opponentId) => {
        try {
            const response = await axios.get(`${backendUrl}/api/users/${opponentId}`);
            if (response.data && response.data.username) {
                setOpponentUsername(response.data.username);
            }
        } catch (error) {
            console.error("Failed to fetch opponent's username", error);
            setOpponentUsername(`User #${opponentId}`);
        }
    }, []);

    useEffect(() => {
        if (status === 'searching' && !socketRef.current) {
            const token = localStorage.getItem('token');
            const newSocket = new WebSocket(`${wsUrl}/api/match/ws/matchmaking?token=${token}`);
            socketRef.current = newSocket;

            newSocket.onopen = () => {
                console.log("WebSocket connection established.");
                onToast('Entering matchmaking queue...', 'info');
            };

            newSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                
                if (data.status === 'waiting') {
                    setStatus('searching');
                } else if (data.status === 'matched') {
                    setMatchDetails(data);
                    if (data.opponent_id) {
                        fetchOpponentUsername(data.opponent_id);
                    }
                    setStatus('matched');
                    newSocket.close();
                } else if (data.status === 'error') {
                    onToast(data.detail || 'A matchmaking error occurred.', 'error');
                    setStatus('error');
                    newSocket.close();
                }
            };

            newSocket.onclose = () => {
                console.log("WebSocket connection closed.");
                socketRef.current = null;
            };

            newSocket.onerror = (err) => {
                console.error("WebSocket error:", err);
                onToast("Connection to matchmaking service failed.", "error");
                setStatus('error');
                socketRef.current = null;
            };
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [status, userId, onToast, fetchOpponentUsername]);

    useEffect(() => {
        let timerId;
        if (status === 'matched' && countdown > 0) {
            timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (status === 'matched' && countdown === 0) {
            onMatchFound(matchDetails, navigate);
        }
        return () => clearTimeout(timerId);
    }, [status, countdown, matchDetails, onMatchFound, navigate]);

    const handleJoinQueue = () => {
        if (!userId) {
            onToast('Still connecting to user session.', 'error');
            return;
        }
        localStorage.removeItem('activeMatch');
        localStorage.removeItem('matchTime');
        setStatus('searching');
    };

    const handleLeaveQueue = () => {
        if (socketRef.current) {
            socketRef.current.close();
        }
        setStatus('idle');
        onToast('Left the matchmaking queue.', 'info');
    };
    
    const renderContent = () => {
        switch (status) {
            case 'matched':
                return (
                    <div className="text-center animate-fade-in">
                        <h2 className="text-4xl font-pixel mb-4 bg-gradient-to-r from-green-500 to-cyan-500 bg-clip-text text-transparent text-shadow-subtle">
                            Opponent Found!
                        </h2>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 my-8">
                            <PlayerCard username={username} />
                            <Swords className="w-16 h-16 text-gray-500 animate-pulse" />
                            <PlayerCard username={opponentUsername} isOpponent={true} />
                        </div>
                        <div className="bg-gray-900/70 pixel-border border-purple-500/50 p-6 max-w-2xl mx-auto">
                            <h3 className="font-tech text-2xl text-purple-300 mb-2">{matchDetails.problem.title}</h3>
                            <p className="text-gray-400 font-tech mb-4">Difficulty: {matchDetails.problem.difficulty}</p>
                            <div className="flex gap-2 justify-center">
                                {matchDetails.problem.tags.map(tag => (
                                    <span key={tag} className="bg-gray-800 text-cyan-300 text-xs font-tech px-2 py-1 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="mt-8">
                            <p className="font-pixel text-2xl text-white">Match starts in... {countdown}</p>
                        </div>
                    </div>
                );
            case 'searching':
                return (
                    <div className="text-center animate-fade-in">
                        <h2 className="text-3xl font-pixel text-white mb-4 text-shadow-subtle">Searching for Opponent</h2>
                        <p className="text-gray-300 font-tech mb-8">Please wait while we find a worthy adversary for you.</p>
                        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                            <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
                            <div className="absolute inset-4 border-4 border-cyan-500/50 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                            <Loader className="w-16 h-16 text-cyan-400 animate-spin-slow" />
                        </div>
                        <button onClick={handleLeaveQueue} className="mt-8 flex items-center mx-auto bg-red-600 text-white font-tech text-lg rounded-xl px-8 py-3 hover:bg-red-700 transition-all duration-200 shadow-lg" >
                            <XCircle className="w-5 h-5 mr-2" />
                            Cancel Search
                        </button>
                    </div>
                );
            case 'error':
                 return (
                    <div className="text-center animate-fade-in">
                        <h2 className="text-3xl font-pixel text-red-500 mb-4 text-shadow-subtle">An Error Occurred</h2>
                        <p className="text-gray-300 font-tech mb-8">We couldn't connect to the matchmaking service. Please try again.</p>
                         <button onClick={() => setStatus('idle')} className="bg-blue-600 text-white font-tech text-lg rounded-xl px-8 py-3 hover:bg-blue-700 transition-all duration-200 shadow-lg" >
                            Back to Menu
                        </button>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <div className="text-center animate-fade-in">
                        <h2 className="text-5xl font-pixel mb-4 bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-transparent text-shadow-subtle">
                            Enter the Arena
                        </h2>
                        <p className="text-gray-300 font-tech mb-12">Challenge a random developer and prove your skills.</p>
                        <button onClick={handleJoinQueue} disabled={!userId} className={` bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-tech text-2xl  rounded-xl px-12 py-6 transition-all duration-200 shadow-lg ${!userId  ? 'opacity-50 cursor-not-allowed'  : 'hover:scale-105 animate-glow'} `} >
                            <div className="flex items-center justify-center">
                                <Users className="w-8 h-8 mr-4" />
                                {userId ? 'Find Match' : 'Connecting...'}
                            </div>
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {renderContent()}
            </div>
        </div>
    );
};

export default Matchmaking;
