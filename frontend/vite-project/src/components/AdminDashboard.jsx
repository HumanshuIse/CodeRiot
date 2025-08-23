import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

const AdminDashboard = ({ onToast, userRole }) => {
  const [pendingProblems, setPendingProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProblemId, setExpandedProblemId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_API_URL;

  // Step 1: Authorization Check
  // This useEffect hook checks if the current user has the 'admin' role.
  // If not, it shows an error toast and redirects them to the homepage.
  useEffect(() => {
    if (userRole && userRole !== 'admin') {
      onToast("Access Denied: You do not have permission to view this page.", "error");
      navigate('/');
    }
  }, [userRole, navigate, onToast]);

  // Step 2: Fetch Pending Problems from the API
  useEffect(() => {
    const fetchPendingProblems = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/api/problems/pending`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setPendingProblems(response.data);
      } catch (err) {
        console.error("Failed to fetch pending problems:", err);
        const errorMessage = err.response?.data?.detail || "An error occurred while fetching problems.";
        setError(errorMessage);
        onToast(errorMessage, "error");
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch data if the user is confirmed to be an admin
    if (userRole === 'admin') {
      fetchPendingProblems();
    }
  }, [backendUrl, onToast, userRole]);

  const handleToggleExpand = (problemId) => {
    setExpandedProblemId(expandedProblemId === problemId ? null : problemId);
  };

  // Step 3: Handle Approve/Reject Actions
  const handleProblemAction = async (problemId, action) => {
    setActionLoading(problemId);
    const token = localStorage.getItem('token');
    try {
      // The 'action' parameter will be either 'approve' or 'reject'
      await axios.post(
        `${backendUrl}/api/problems/${problemId}/${action}`,
        {}, // No request body is needed
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // Remove the problem from the list in the UI
      setPendingProblems(prev => prev.filter(p => p.id !== problemId));
      onToast(`Problem successfully ${action}ed!`, 'success');

    } catch (err) {
      console.error(`Failed to ${action} problem:`, err);
      const errorMessage = err.response?.data?.detail || `Could not ${action} the problem.`;
      onToast(errorMessage, 'error');
    } finally {
      setActionLoading(null);
    }
  };
  
  // Don't render anything until the role check is complete
  if (!userRole || userRole !== 'admin') {
    return (
        <div className="h-screen bg-black flex items-center justify-center text-white font-pixel">
          <Loader className="w-8 h-8 animate-spin mr-4" /> Checking permissions...
        </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white font-pixel">
        <Loader className="w-8 h-8 animate-spin mr-4" /> Loading Admin Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-red-400 font-pixel">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h2 className="text-2xl">Error Loading Data</h2>
        <p className="font-tech mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-tech p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-pixel text-cyan-400 mb-6 border-b border-gray-800 pb-4">
          Admin Dashboard: Pending Problems
        </h1>

        {pendingProblems.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-pixel text-gray-300">All Clear!</h2>
            <p className="text-gray-400 mt-2">There are no pending problem submissions to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingProblems.map((problem) => (
              <div key={problem.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden transition-all duration-300">
                <button
                  onClick={() => handleToggleExpand(problem.id)}
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-800 focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      problem.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <h2 className="text-lg font-semibold text-white">{problem.title}</h2>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-sm text-gray-400">Submitted by: <span className="font-semibold text-gray-300">{problem.author_username || 'N/A'}</span></span>
                     {expandedProblemId === problem.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>
                
                {expandedProblemId === problem.id && (
                  <div className="bg-black/50 p-4 border-t border-gray-700 animate-fade-in-down">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-pixel text-cyan-400 mb-2">Description</h3>
                          <div className="text-gray-300 text-sm space-y-3 bg-gray-800 p-3 rounded-md">
                            <pre className="whitespace-pre-wrap font-tech leading-relaxed">{problem.description}</pre>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-pixel text-cyan-400 mb-2">Constraints</h3>
                          <div className="text-gray-300 text-sm bg-gray-800 p-3 rounded-md">
                            <pre className="whitespace-pre-wrap font-tech">{problem.constraints}</pre>
                          </div>
                        </div>
                         <div>
                            <h3 className="font-pixel text-cyan-400 mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {problem.tags && problem.tags.map(tag => (
                                    <span key={tag} className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-tech">{tag}</span>
                                ))}
                            </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        <h3 className="font-pixel text-cyan-400 mb-2">Test Cases</h3>
                        {problem.test_cases.map((tc, index) => (
                          <div key={index} className="bg-gray-800 p-3 rounded-md text-xs font-mono">
                            <p className="text-gray-400 font-semibold mb-1">Case #{index + 1}</p>
                            <label className="text-gray-500">Input:</label>
                            <pre className="bg-gray-900 p-2 rounded whitespace-pre-wrap text-white">{tc.input}</pre>
                            <label className="text-gray-500 mt-2 block">Expected Output:</label>
                            <pre className="bg-gray-900 p-2 rounded whitespace-pre-wrap text-white">{tc.expected_output}</pre>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-700">
                      <button 
                        onClick={() => handleProblemAction(problem.id, 'reject')}
                        disabled={actionLoading === problem.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded disabled:opacity-50 text-sm font-semibold transition-colors"
                      >
                        {actionLoading === problem.id ? <Loader className="w-4 h-4 animate-spin"/> : <XCircle size={16} />}
                        Reject
                      </button>
                      <button 
                        onClick={() => handleProblemAction(problem.id, 'approve')}
                        disabled={actionLoading === problem.id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50 text-sm font-semibold transition-colors"
                      >
                        {actionLoading === problem.id ? <Loader className="w-4 h-4 animate-spin"/> : <CheckCircle size={16} />}
                        Approve
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;