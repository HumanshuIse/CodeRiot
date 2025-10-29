import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Award, Loader2, ServerCrash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Leaderboard = ({ onToast }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  const backendUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      try {
        // Get current user info
        if (token) {
          const userResponse = await axios.get(`${backendUrl}/api/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setCurrentUserId(userResponse.data.id);
        }

        // Fetch leaderboard
        const response = await axios.get(`${backendUrl}/api/leaderboard?limit=100`);
        setLeaderboard(response.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        const errorMessage = err.response?.data?.detail || "Could not load leaderboard.";
        setError(errorMessage);
        onToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [backendUrl, onToast]);

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-400 font-bold';
    if (rank === 2) return 'text-gray-400 font-bold';
    if (rank === 3) return 'text-orange-400 font-bold';
    return 'text-gray-300';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-tech">
        <Loader2 className="w-8 h-8 animate-spin mr-3 text-cyan-400" />
        <p>Loading Leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-tech text-center px-4">
        <ServerCrash className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-pixel text-red-400 mb-2">An Error Occurred</h2>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 font-tech">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-pixel mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            🏆 LEADERBOARD
          </h1>
          <p className="text-gray-400 text-lg">Top Coders Ranked by Problems Solved</p>
        </div>

        <Card className="bg-gray-900/70 border border-gray-700 pixel-border">
          <CardHeader>
            <CardTitle className="text-2xl font-tech text-cyan-400 flex items-center">
              <Trophy className="w-6 h-6 mr-3" />
              Global Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {leaderboard.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <p className="text-xl">No rankings yet. Be the first to solve a problem!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-700">
                    <tr className="text-gray-400 text-sm">
                      <th className="text-left p-4 w-20">Rank</th>
                      <th className="text-left p-4">Username</th>
                      <th className="text-right p-4">Problems Solved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry) => (
                      <tr
                        key={entry.user_id}
                        className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                          entry.user_id === currentUserId ? 'bg-cyan-900/20 border-cyan-500/50' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {getRankIcon(entry.rank)}
                            <span className={`text-lg ${getRankColor(entry.rank)}`}>
                              #{entry.rank}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`text-lg ${entry.user_id === currentUserId ? 'text-cyan-400 font-semibold' : 'text-white'}`}>
                            {entry.username}
                            {entry.user_id === currentUserId && (
                              <span className="ml-2 text-xs text-cyan-400">(You)</span>
                            )}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-lg font-semibold text-green-400">
                            {entry.problems_solved}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/10 border-yellow-500/30 pixel-border">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <p className="text-3xl font-pixel text-yellow-400 mb-2">
                {leaderboard[0]?.username || 'N/A'}
              </p>
              <p className="text-gray-400 text-sm">Top Coder</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/10 border-cyan-500/30 pixel-border">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
              <p className="text-3xl font-pixel text-cyan-400 mb-2">
                {leaderboard.length}
              </p>
              <p className="text-gray-400 text-sm">Total Competitors</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/10 border-green-500/30 pixel-border">
            <CardContent className="p-6 text-center">
              <Medal className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-3xl font-pixel text-green-400 mb-2">
                {leaderboard.reduce((sum, entry) => sum + entry.problems_solved, 0)}
              </p>
              <p className="text-gray-400 text-sm">Total Problems Solved</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;