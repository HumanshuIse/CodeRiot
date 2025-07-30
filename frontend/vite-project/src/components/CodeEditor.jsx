// // src/components/CodeEditor.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Split from 'react-split';
import { Play, Pause, UploadCloud, Loader, CheckCircle2, XCircle, Settings, Maximize, FileText } from 'lucide-react';
import Editor from '@monaco-editor/react';

// Component to inject CSS for the draggable splitter handles
const GutterStyle = () => (
    <style>{`
        .gutter {
            background-color: #1f2937; /* bg-gray-800 */
            background-repeat: no-repeat;
            background-position: 50%;
        }
        .gutter:hover {
            background-color: #374151; /* bg-gray-700 */
        }
        .gutter.gutter-horizontal {
            cursor: col-resize;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="30"><path d="M2 0 v30 M5 0 v30 M8 0 v30" stroke="%234b5563" stroke-width="1.5" /></svg>');
        }
        .gutter.gutter-vertical {
            cursor: row-resize;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="10"><path d="M0 2 h30 M0 5 h30 M0 8 h30" stroke="%234b5563" stroke-width="1.5" /></svg>');
        }
    `}</style>
);


const CodeEditor = ({ problem, match }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);
  const [testCaseOutputs, setTestCaseOutputs] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('Idle');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('testCases');
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const JUDGE_SERVER_URL = 'http://localhost:8001/execute';
  const SUBMISSION_API_URL = 'http://localhost:8000/api/submission';
  
  // Timer logic
  useEffect(() => {
    let timerId = null;
    if (isTimerRunning) {
      timerId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isTimerRunning]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleTimerToggle = () => {
    setIsTimerRunning(prev => !prev);
  };
  
  const languageTemplates = {
    python: `# ${problem?.title || 'Problem Title'}\n\nclass Solution:\n    def solve(self, nums):\n        # Write your code here\n        return []\n`,
    javascript: `// ${problem?.title || 'Problem Title'}\n\nclass Solution {\n    solve(nums) {\n        // Write your code here\n        return [];\n    }\n}\n`,
    java: `// ${problem?.title || 'Problem Title'}\n\nimport java.util.*;\n\nclass Solution {\n    public List<Integer> solve(int[] nums) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}\n`,
    cpp: `// ${problem?.title || 'Problem Title'}\n\n#include <vector>\n#include <numeric>\n\nclass Solution {\npublic:\n    int longestSubarray(std::vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};`
  };

  useEffect(() => {
    if (problem) {
      setCode(languageTemplates[language] || '');
      setTestCaseOutputs({});
      setActiveTestCaseIndex(0);
      setActiveTab('testCases');
    }
  }, [problem, language]);

  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    const currentCase = problem.test_cases.sample[activeTestCaseIndex];
    
    try {
      const response = await axios.post(JUDGE_SERVER_URL, {
        language, code, input: currentCase.input,
      });
      const output = response.data.error || response.data.output;
      setTestCaseOutputs(prev => ({ ...prev, [activeTestCaseIndex]: { output, expected: currentCase.expected_output } }));
    } catch (e) {
      setTestCaseOutputs(prev => ({ ...prev, [activeTestCaseIndex]: { output: "Failed to connect to judge.", expected: currentCase.expected_output } }));
    } finally {
      setIsRunning(false);
      setActiveTab('testCases');
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setSubmissionStatus('Submitting...');
    setSubmissionResult(null);
    setActiveTab('submission');

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(SUBMISSION_API_URL, {
            problem_id: problem.id, language, code, match_id: match?.match_id
        }, { headers: { 'Authorization': `Bearer ${token}` } });
        setSubmissionResult(response.data);
        setSubmissionStatus('Finished');
    } catch (error) {
        setSubmissionStatus('Error');
        setSubmissionResult({ status: error.response?.data?.detail || "An unexpected error occurred." });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!problem) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white font-pixel">
        <Loader className="w-8 h-8 animate-spin mr-4" />
        Waiting for a match...
      </div>
    );
  }

  const sampleTestCases = problem.test_cases?.sample || [];

  return (
    <div className="h-screen bg-black text-white p-2 font-tech">
      <GutterStyle />
      <Split
        className="flex h-full"
        sizes={[50, 50]}
        minSize={400}
        gutterSize={8}
      >
        {/* Left Pane */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 flex flex-col overflow-y-auto">
           {/* MODIFIED: Removed "Editorial" and "Solutions" buttons */}
           <div className="flex-shrink-0 flex border-b border-gray-800">
              <button className="py-2 px-4 text-sm text-white bg-gray-800 flex items-center gap-2"><FileText size={16}/> Description</button>
              <button className="py-2 px-4 text-sm text-gray-400 hover:text-white">Submissions</button>
          </div>
          <div className="p-4 space-y-4">
              <h1 className="font-pixel text-xl text-cyan-400">{problem.title}</h1>
              <div className="text-sm text-gray-400">
                  <span className={`px-3 py-1 rounded-full text-xs ${ problem.difficulty === 'Easy' ? 'bg-green-900 text-green-300' : problem.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300' }`}>
                      {problem.difficulty}
                  </span>
              </div>
              <div className="text-gray-300 text-sm space-y-4">
                  <pre className="whitespace-pre-wrap font-tech leading-relaxed">{problem.description}</pre>
                  {problem.constraints && (
                      <div>
                          <h3 className="font-bold mb-2">Constraints</h3>
                          <pre className="whitespace-pre-wrap font-tech text-gray-400">{problem.constraints}</pre>
                      </div>
                  )}
              </div>
          </div>
        </div>

        {/* Right Pane */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 flex flex-col">
          {/* Editor Header */}
          <div className="bg-gray-800 p-2 flex justify-between items-center flex-shrink-0">
             <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600">
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
            </select>
            <div className='flex items-center gap-4 text-gray-400'>
                <div className="flex items-center gap-2 text-yellow-400">
                    <button onClick={handleTimerToggle} className="hover:text-white focus:outline-none" aria-label="Toggle Timer">
                        {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <span className="font-mono text-lg">{formatTime(time)}</span>
                </div>
              <button className='hover:text-white'><Settings size={18} /></button>
              <button className='hover:text-white'><Maximize size={18} /></button>
            </div>
          </div>
          
          {/* Vertical Splitter */}
          <div className="flex-grow flex flex-col overflow-hidden">
            <Split
              className="flex flex-col h-full"
              direction="vertical"
              sizes={[65, 35]}
              minSize={100}
              gutterSize={8}
            >
              {/* Top Pane: Editor */}
              <div className="overflow-hidden">
                <Editor height="100%" language={language} theme={'vs-dark'} value={code} onChange={(newValue) => setCode(newValue)} options={{ minimap: { enabled: false }, fontSize: 14 }} />
              </div>

              {/* Bottom Pane: Test Cases / Submission */}
              <div className="flex flex-col min-h-0 overflow-hidden">
                {/* MODIFIED: Removed the "Submission" tab and its conditional logic */}
                <div className="flex border-b border-gray-800 flex-shrink-0">
                  <button onClick={() => setActiveTab('testCases')} className={`px-4 py-2 text-sm bg-gray-800 text-white`}>Test Cases</button>
                </div>
                <div className='flex-grow overflow-y-auto p-2'>
                  {/* The content is now always the test case view */}
                  <div>
                      <div className="flex items-center gap-2 mb-2">
                          {sampleTestCases.map((_, index) => (
                              <button key={index} onClick={() => setActiveTestCaseIndex(index)} className={`px-3 py-1 rounded text-xs ${activeTestCaseIndex === index ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                  Case {index + 1}
                              </button>
                          ))}
                      </div>
                      {sampleTestCases[activeTestCaseIndex] && (
                          <div className="font-mono text-xs space-y-2">
                              <div><label className="text-gray-400">Input:</label><pre className="bg-gray-800 p-2 rounded whitespace-pre-wrap">{sampleTestCases[activeTestCaseIndex].input}</pre></div>
                              <div><label className="text-gray-400">Expected:</label><pre className="bg-gray-800 p-2 rounded whitespace-pre-wrap">{sampleTestCases[activeTestCaseIndex].expected_output}</pre></div>
                              <div>
                                  <label className="text-gray-400">Your Output:</label>
                                  <div className="bg-gray-800 p-2 rounded whitespace-pre-wrap min-h-[40px] flex justify-between items-center">
                                      <pre>{testCaseOutputs[activeTestCaseIndex]?.output ?? 'Run code to see output'}</pre>
                                      {testCaseOutputs[activeTestCaseIndex] && (testCaseOutputs[activeTestCaseIndex].output?.trim() === testCaseOutputs[activeTestCaseIndex].expected?.trim()
                                          ? <CheckCircle2 className="text-green-500 flex-shrink-0" size={16}/>
                                          : <XCircle className="text-red-500 flex-shrink-0" size={16}/>
                                      )}
                                  </div>
                              </div>
                          </div>
                      )}
                      {/* You might want to display submission status here as a new feature */}
                      {submissionStatus !== 'Idle' && (
                        <div className="mt-4">
                           <p>Submission Status: <span className="font-bold">{submissionStatus}</span></p>
                            {submissionResult && (
                                <div className={`mt-2 p-2 rounded ${submissionResult.status.includes('Accepted') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                    <p>Final Verdict: {submissionResult.status}</p>
                                </div>
                            )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </Split>
          </div>
          {/* Action Bar */}
          <div className="flex-shrink-0 flex justify-end items-center gap-4 p-2 border-t border-gray-800 bg-gray-900">
            <button onClick={handleRunCode} disabled={isRunning} className="flex items-center gap-2 px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 text-sm">
                {isRunning ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Run
            </button>
            <button onClick={handleSubmitCode} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50 text-sm">
                {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </Split>
    </div>
  );
};

export default CodeEditor;