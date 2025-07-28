// src/components/CodeEditor.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, UploadCloud, Loader, CheckCircle2, XCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ problem, match }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);
  const [testCaseOutputs, setTestCaseOutputs] = useState({});
  const [isRunningCase, setIsRunningCase] = useState(null);

  const [submissionStatus, setSubmissionStatus] = useState('Idle');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('testCases');

  const JUDGE_SERVER_URL = 'http://localhost:8001/execute';
  const SUBMISSION_API_URL = 'http://localhost:8000/api/submission';

  const languageTemplates = {
    python: `# ${problem?.title || 'Problem Title'}\n\ndef solve():\n  # Write your code here\n  print("Hello, Python!")\n\nsolve()`,
    javascript: `// ${problem?.title || 'Problem Title'}\n\nfunction solve() {\n  // Write your code here\n  console.log("Hello, JavaScript!");\n}\n\nsolve();`,
    java: `// ${problem?.title || 'Problem Title'}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        System.out.println("Hello, Java!");\n    }\n}`,
    cpp: `// ${problem?.title || 'Problem Title'}\n\n#include <iostream>\n\nvoid solve() {\n    // Write your code here\n    std::cout << "Hello, C++!" << std::endl;\n}\n\nint main() {\n    solve();\n    return 0;\n}`
  };

  useEffect(() => {
    if (problem) {
      setCode(languageTemplates[language] || '');
      setTestCaseOutputs({});
      setActiveTestCaseIndex(0);
    }
  }, [problem, language]);

  const handleRunCode = async (caseIndex) => {
    setIsRunningCase(caseIndex);
    const currentCase = problem.test_cases.sample[caseIndex];
    
    try {
      const response = await axios.post(JUDGE_SERVER_URL, {
        language, code, input: currentCase.input,
      });
      const output = response.data.error || response.data.output;
      setTestCaseOutputs(prev => ({ ...prev, [caseIndex]: { output, expected: currentCase.expected_output } }));
    } catch (e) {
      setTestCaseOutputs(prev => ({ ...prev, [caseIndex]: { output: "Failed to connect to judge.", expected: currentCase.expected_output } }));
    } finally {
      setIsRunningCase(null);
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
        <div className="flex flex-col lg:flex-row h-full gap-2">
            {/* ✅ MODIFIED: Left Panel now contains both description AND test case tabs */}
            <div className="w-full lg:w-1/2 bg-gray-900 rounded-lg border border-gray-800 flex flex-col">
                {/* Top part of the left panel for description */}
                <div className="p-4 overflow-y-auto">
                    <h1 className="font-pixel text-xl text-cyan-400 mb-4 flex-shrink-0">{problem.title}</h1>
                    <div className="text-sm text-gray-400 mb-4 flex-shrink-0">
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
                
                {/* ✅ MOVED: Bottom part of the left panel for I/O */}
                <div className="border-t border-gray-800 mt-auto flex flex-col h-1/2 max-h-80 flex-shrink-0">
                    <div className="flex border-b border-gray-800 flex-shrink-0">
                        <button onClick={() => setActiveTab('testCases')} className={`flex-1 py-2 text-center text-sm ${activeTab === 'testCases' ? 'bg-gray-800' : ''}`}>Test Cases</button>
                        <button onClick={() => setActiveTab('submission')} className={`flex-1 py-2 text-center text-sm ${activeTab === 'submission' ? 'bg-gray-800' : ''}`}>Submission</button>
                    </div>
                    
                    {activeTab === 'testCases' && (
                        <div className="p-2 flex-grow flex flex-col overflow-y-auto">
                           {/* Test Case Content (no changes to logic) */}
                           <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                                {sampleTestCases.map((_, index) => (
                                    <button key={index} onClick={() => setActiveTestCaseIndex(index)} className={`px-3 py-1 rounded text-sm ${activeTestCaseIndex === index ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                        Case {index + 1}
                                    </button>
                                ))}
                            </div>
                            {sampleTestCases[activeTestCaseIndex] && (
                                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs">
                                    <div><label className="text-gray-400">Input:</label><pre className="bg-gray-800 p-2 rounded whitespace-pre-wrap">{sampleTestCases[activeTestCaseIndex].input}</pre></div>
                                    <div><label className="text-gray-400">Expected:</label><pre className="bg-gray-800 p-2 rounded whitespace-pre-wrap">{sampleTestCases[activeTestCaseIndex].expected_output}</pre></div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="text-gray-400">Your Output:</label>
                                        <div className="bg-gray-800 p-2 rounded whitespace-pre-wrap min-h-[40px] flex justify-between items-center">
                                            <pre>{testCaseOutputs[activeTestCaseIndex]?.output}</pre>
                                            {testCaseOutputs[activeTestCaseIndex] && (testCaseOutputs[activeTestCaseIndex].output?.trim() === testCaseOutputs[activeTestCaseIndex].expected?.trim()
                                                ? <CheckCircle2 className="text-green-500 flex-shrink-0" size={16}/>
                                                : <XCircle className="text-red-500 flex-shrink-0" size={16}/>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="pt-2 mt-auto flex-shrink-0">
                                <button onClick={() => handleRunCode(activeTestCaseIndex)} disabled={isRunningCase !== null} className="flex items-center gap-2 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">
                                    {isRunningCase === activeTestCaseIndex ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                    Run Case {activeTestCaseIndex + 1}
                                </button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'submission' && (
                        <div className="p-4">
                            <p>Status: <span className="font-bold">{submissionStatus}</span></p>
                            {submissionResult && (
                                <div className={`mt-2 p-2 rounded ${submissionResult.status.includes('Accepted') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                    <p>Final Verdict: {submissionResult.status}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ MODIFIED: Right Panel now ONLY contains the code editor and fills all available space */}
            <div className="w-full lg:w-1/2 bg-gray-900 rounded-lg border border-gray-800 flex flex-col">
                <div className="bg-gray-800 p-2 flex justify-between items-center flex-shrink-0">
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600">
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                    </select>
                    <div className="flex items-center gap-4">
                        <button onClick={handleSubmitCode} disabled={isSubmitting} className="flex items-center gap-2 px-3 py-1 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50">
                            {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                            {isSubmitting ? 'Submitting' : 'Submit'}
                        </button>
                    </div>
                </div>
                <div className="flex-grow p-1">
                    <Editor height="100%" language={language} theme={'vs-dark'} value={code} onChange={(newValue) => setCode(newValue)} options={{ minimap: { enabled: false }, fontSize: 14 }} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default CodeEditor;