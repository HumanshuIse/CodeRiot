// src/components/CodeEditor.jsx
import React, { useState, useEffect, useRef, Suspense } from 'react';
import axios from 'axios';
import { Play, Pause, UploadCloud, Loader, CheckCircle2, XCircle, FileText, BarChart2, LogOut, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// MODIFIED: Import the useMatch hook
import { useMatch } from '../context/MatchContext';

// Dynamically import components that were causing build issues.
const Split = React.lazy(() => import('react-split'));
const Editor = React.lazy(() => import('@monaco-editor/react'));

const GutterStyle = () => (
    <style>{`
        .gutter { background-color: #1f2937; background-repeat: no-repeat; background-position: 50%; }
        .gutter:hover { background-color: #374151; }
        .gutter.gutter-horizontal { cursor: col-resize; }
        .gutter.gutter-vertical { cursor: row-resize; }

        @keyframes pulse-yellow {
            0%, 100% { box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.7); }
            50% { box-shadow: 0 0 10px 5px rgba(250, 204, 21, 0); }
        }
        .animate-pulse-yellow {
            animation: pulse-yellow 2s infinite;
        }
    `}</style>
);

const LoadingFallback = () => (
    <div className="h-screen bg-black flex items-center justify-center text-white font-pixel">
        <Loader className="w-8 h-8 animate-spin mr-4" /> Loading Editor...
    </div>
);

const CodeEditor = ({ onToast }) => {
  // MODIFIED: Get state and functions from the context
  const { activeMatch, endMatch } = useMatch();

  const [problem, setProblem] = useState(null);
  const [match, setMatch] = useState(null);
  const navigate = useNavigate();
  
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);
  const [testCaseOutputs, setTestCaseOutputs] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('testcases');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [opponentNotification, setOpponentNotification] = useState('');
  const [statusMessage, setStatusMessage] = useState('Initializing match...');
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hint, setHint] = useState('');
  const [showHint, setShowHint] = useState(false);  

  const backendUrl = import.meta.env.VITE_API_URL;
  const wsUrl = import.meta.env.VITE_WS_URL;
  const judgeServerUrl = import.meta.env.VITE_JUDGE_SERVER_URL;
  const JUDGE_SERVER_URL = `${judgeServerUrl}/execute`;
  const SUBMISSION_API_URL = `${backendUrl}/api/submission`;
  const HINT_API_URL = `${backendUrl}/api/problems`;
  const wsRef = useRef(null);

  // MODIFIED: This useEffect is now driven by the activeMatch from context
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!activeMatch) {
      onToast("No active match found.", "error");
      navigate('/matchmaking');
      return;
    }
    
    setProblem(activeMatch.problem);
    setMatch({ match_id: activeMatch.match_id, opponent_id: activeMatch.opponent_id });
    const savedTime = parseInt(localStorage.getItem('matchTime') || '0', 10);
    setTime(savedTime);
    setIsTimerRunning(true);
    setStatusMessage('');

    const ws = new WebSocket(`${wsUrl}/api/match/ws/matchmaking?token=${token}&match_id=${activeMatch.match_id}`);
    wsRef.current = ws;

    ws.onopen = () => console.log("WebSocket connection established for the match.");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch(data.status) {
        case 'opponent_finished':
          setOpponentNotification(data.detail);
          break;
        case 'opponent_quit':
          setIsTimerRunning(false);
          onToast("Opponent has left the match.", "info");
          endMatch(); // Use context to end match
          setTimeout(() => navigate('/matchmaking'), 3000);
          break;
        case 'opponent_reconnected':
          setOpponentNotification("Opponent has reconnected.");
          break;
        case 'error':
          onToast(`Match Error: ${data.detail}`, 'error');
          endMatch(); // Use context to end match
          setTimeout(() => navigate('/matchmaking'), 3000);
          break;
        default:
          console.log("Received unhandled WebSocket message:", data);
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      onToast("Connection to the match server failed. Please refresh.", "error");
      setIsTimerRunning(false);
    };
    ws.onclose = () => console.log("WebSocket connection closed.");

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [activeMatch, navigate, onToast, endMatch, wsUrl]);

  useEffect(() => {
    let timerId = null;
    if (isTimerRunning && match) {
      timerId = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          localStorage.setItem('matchTime', newTime.toString());
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isTimerRunning, match]);

  useEffect(() => {
    if (problem) {
      const templateKey = `frontend_template_${language}`;
      const template = problem[templateKey];
      setCode(template || `// Starter code for ${language} is not available.`);
      setTestCaseOutputs({});
      setActiveTestCaseIndex(0);
      setSubmissionResult(null);
      setActiveTab('testcases');
      setOpponentNotification('');
    }
  }, [problem, language]);
  
  useEffect(()=>{
    if(opponentNotification) {
      const timer = setTimeout(() => {
        setOpponentNotification('');
      }, 6000);
      return () => clearTimeout(timer);
    }
  },[opponentNotification]);

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleTimerToggle = () => setIsTimerRunning(prev => !prev);
  
  const handleQuitMatch = async () => {
    if (!match?.match_id || !window.confirm("Are you sure you want to quit? This will end the match and be recorded as a loss.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${backendUrl}/api/match/quit`, { match_id: match.match_id }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // MODIFIED: Use context to end match
      endMatch();
      onToast("You have left the match.", "info");
      navigate('/matchmaking');
    } catch (error) {
      console.error("Failed to quit match:", error);
      onToast(error.response?.data?.detail || "Could not quit the match. Please try again.", "error");
    }
  };
  
  const testCases = problem?.test_cases || [];

  const handleRunCode = async () => {
    if (isRunning || !problem) return;
    const currentCase = testCases[activeTestCaseIndex];
    if (!currentCase) return;
    
    setIsRunning(true);
    setSubmissionResult(null); 
    setActiveTab('testcases');

    try {
      const response = await axios.post(JUDGE_SERVER_URL, { language, code, input: currentCase.input });
      const output = response.data.error || response.data.output;
      setTestCaseOutputs(prev => ({ ...prev, [activeTestCaseIndex]: { output, expected: currentCase.expected_output } }));
    } catch (e) {
      const errorMsg = e.response?.data?.detail || "Failed to connect to judge.";
      setTestCaseOutputs(prev => ({ ...prev, [activeTestCaseIndex]: { output: errorMsg, expected: currentCase.expected_output } }));
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (isSubmitting || !problem) return;
    setIsSubmitting(true);
    setSubmissionResult(null);
    setActiveTab('submission');
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(SUBMISSION_API_URL, {
            problem_id: problem.id, language, code, match_id: match?.match_id, opponent_id: match?.opponent_id
        }, { headers: { 'Authorization': `Bearer ${token}` } });
        
        setSubmissionResult(response.data.status);
        
        if (response.data.status.startsWith('Accepted')) {
            onToast("Congratulations! You solved the problem! redirecting to matchmaking", "success");
            // MODIFIED: Use context to end match
            setTimeout(()=>{
              endMatch();
            },4000);
        }
    } catch (error) {
        console.error("Submission failed:", error);
        const errorMsg = error.response?.data?.detail || "An unexpected error occurred.";
        setSubmissionResult(`Submission Failed: ${errorMsg}`);
        onToast(errorMsg, 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleGetHint = async () => {
    if (!problem) return;
    setIsHintLoading(true);
    setHint('');
    try {
        const response = await axios.post(`${HINT_API_URL}/${problem.id}/hint`, { code });
        setHint(response.data.hint);
        setShowHint(true);
    } catch (error) {
        console.error("Failed to get hint:", error);
        onToast(error.response?.data?.detail || "Could not fetch a hint at this moment.", "error");
    } finally {
        setIsHintLoading(false);
    }
  };
  
  const getStatusColorClass = (status) => {
    if (!status) return 'text-gray-400';
    if (status.startsWith('Accepted')) return 'text-green-500';
    if (status.startsWith('Wrong Answer') || status.startsWith('Runtime Error')) return 'text-red-500';
    if (status.startsWith('Time Limit Exceeded')) return 'text-yellow-500';
    return 'text-gray-400';
  };

  if (!problem || !match) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white font-pixel">
        <Loader className="w-8 h-8 animate-spin mr-4" /> {statusMessage}
      </div>
    );
  }
  
  const visibleTestCases = testCases.slice(0, 2);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="h-screen bg-black text-white p-2 font-tech">
        {opponentNotification && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg z-50 animate-pulse">
            <p>📣 {opponentNotification}</p>
          </div>
        )}

        {showHint && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={() => setShowHint(false)}>
              <div className="bg-gray-800 border border-yellow-400 rounded-lg shadow-2xl p-6 max-w-lg w-full transform transition-all duration-300 scale-95 hover:scale-100" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center mb-4">
                      <Lightbulb className="text-yellow-400 mr-3" size={28} />
                      <h2 className="text-2xl font-pixel text-yellow-300">HintAI</h2>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{hint}</p>
                  <button onClick={() => setShowHint(false)} className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded transition-colors duration-200">
                      Got it, thanks!
                  </button>
              </div>
          </div>
        )}

        <GutterStyle />
        <Split className="flex h-full" sizes={[50, 50]} minSize={400} gutterSize={8}>
          <div className="bg-gray-900 rounded-lg border border-gray-800 flex flex-col overflow-y-auto">
            <div className="flex-shrink-0 flex border-b border-gray-800">
                <button className="py-2 px-4 text-sm text-white bg-gray-800 flex items-center gap-2"><FileText size={16}/> Description</button>
            </div>
            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="font-pixel text-xl text-cyan-400">{problem.title}</h1>
                    <button 
                        onClick={handleGetHint} 
                        disabled={isHintLoading} 
                        className="flex items-center gap-2 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded disabled:opacity-50 text-xs text-gray-900 font-bold animate-pulse-yellow"
                    >
                        {isHintLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}Hint
                    </button>
                </div>
                <div className="text-sm text-gray-400">
                    <span className={`px-3 py-1 rounded-full text-xs ${ problem.difficulty === 'Easy' ? 'bg-green-900 text-green-300' : problem.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300' }`}>
                        {problem.difficulty}
                    </span>
                </div>
                <div className="text-gray-300 text-sm space-y-4">
                    <pre className="whitespace-pre-wrap font-tech leading-relaxed">{problem.description}</pre>
                </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg border border-gray-800 flex flex-col">
              <div className="bg-gray-800 p-2 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-4">
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600">
                  <option value="cpp">C++</option>
                  <option value="python">Python</option>
                </select>
              </div>
              <div className='flex items-center gap-4 text-gray-400'>
                <div className="flex items-center gap-2 text-yellow-400">
                  <button onClick={handleTimerToggle} className="hover:text-white">
                    {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <span className="font-mono text-lg">{formatTime(time)}</span>
                </div>
                <button onClick={handleQuitMatch} title="Quit Match" className="flex items-center gap-2 text-red-400 hover:text-white">
                    <LogOut size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex-grow flex flex-col overflow-hidden">
              <Split className="flex flex-col h-full" direction="vertical" sizes={[65, 35]} minSize={100} gutterSize={8}>
                <div className="overflow-hidden">
                  <Editor height="100%" language={language} theme={'vs-dark'} value={code} onChange={(v) => setCode(v)} options={{ minimap: { enabled: false }, fontSize: 14 }} />
                </div>

                <div className="flex flex-col min-h-0 overflow-hidden">
                  <div className="flex border-b border-gray-800 flex-shrink-0">
                    <button onClick={() => setActiveTab('testcases')} className={`px-4 py-2 text-sm flex items-center gap-2 ${activeTab === 'testcases' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                      <FileText size={16}/> Test Cases
                    </button>
                    <button onClick={() => setActiveTab('submission')} className={`px-4 py-2 text-sm flex items-center gap-2 ${activeTab === 'submission' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                      <BarChart2 size={16}/> Submission
                    </button>
                  </div>
                  <div className='flex-grow overflow-y-auto p-2'>
                    {activeTab === 'testcases' && testCases.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {visibleTestCases.map((_, index) => (
                            <button key={index} onClick={() => setActiveTestCaseIndex(index)} className={`px-3 py-1 rounded text-xs ${activeTestCaseIndex === index ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                              Case {index + 1}
                            </button>
                          ))}
                        </div>
                        {visibleTestCases[activeTestCaseIndex] && (
                          <div className="font-mono text-xs space-y-2">
                            <div><label className="text-gray-400">Input:</label><pre className="bg-gray-800 p-2 rounded whitespace-pre-wrap">{visibleTestCases[activeTestCaseIndex].input}</pre></div>
                            <div><label className="text-gray-400">Expected:</label><pre className="bg-gray-800 p-2 rounded whitespace-pre-wrap">{visibleTestCases[activeTestCaseIndex].expected_output}</pre></div>
                            <div>
                              <label className="text-gray-400">Your Output:</label>
                              <div className="bg-gray-800 p-2 rounded whitespace-pre-wrap min-h-[40px] flex justify-between items-center">
                                <pre>{testCaseOutputs[activeTestCaseIndex]?.output ?? 'Run code to see output'}</pre>
                                {testCaseOutputs[activeTestCaseIndex] && (String(testCaseOutputs[activeTestCaseIndex].output ?? '').trim() === String(visibleTestCases[activeTestCaseIndex].expected_output ?? '').trim()
                                  ? <CheckCircle2 className="text-green-500 shrink-0" size={16}/>
                                  : <XCircle className="text-red-500 shrink-0" size={16}/>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'submission' && (
                       <div className="p-4 text-center">
                        {isSubmitting ? (
                          <div className="flex flex-col items-center justify-center h-full">
                            <Loader className="w-8 h-8 animate-spin text-blue-400" />
                            <p className="mt-4 text-lg text-gray-300">Evaluating your code...</p>
                          </div>
                        ) : submissionResult ? (
                          <div className="flex flex-col items-center">
                              <span className={`text-3xl font-bold ${getStatusColorClass(submissionResult)} mb-4`}>
                                  {submissionResult.startsWith('Accepted') ? <CheckCircle2 size={48} className="mb-2"/> : <XCircle size={48} className="mb-2"/>}
                                  {submissionResult}
                              </span>
                              <p className="text-gray-400 text-sm">
                                  {submissionResult.startsWith('Accepted') ? "Great job! All test cases passed." : "Keep trying! Review your code and the specific test case failures."}
                              </p>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-lg">
                            Submit your code to see the results here.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Split>
            </div>
            <div className="flex-shrink-0 flex justify-end items-center gap-4 p-2 border-t border-gray-800 bg-gray-900">
              <button onClick={handleRunCode} disabled={isRunning} className="flex items-center gap-2 px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 text-sm">
                {isRunning ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}Run
              </button>
              <button onClick={handleSubmitCode} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50 text-sm">
                {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}Submit
              </button>
            </div>
          </div>
        </Split>
      </div>
    </Suspense>
  );
};

export default CodeEditor;