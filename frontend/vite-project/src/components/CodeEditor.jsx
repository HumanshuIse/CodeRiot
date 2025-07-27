// src/components/CodeEditor.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Settings, Copy, Download, RefreshCw, FileText, Bug, UploadCloud, Loader } from 'lucide-react';
import Editor from '@monaco-editor/react';

// CodeEditor doesn't need useNavigate directly as it's a content component.
// Navigation logic for 'problem not found' or 'not logged in' is handled in App.jsx.
const CodeEditor = ({ problem, match }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python'); // Default to a common competitive language
  
  // State for the "Run" functionality
  const [runOutput, setRunOutput] = useState('');
  const [runInput, setRunInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  // State for the "Submit" functionality
  const [submissionStatus, setSubmissionStatus] = useState('Idle'); // Idle, Submitting, Finished
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState('problem'); // Default to problem tab

  // URLs
  const JUDGE_SERVER_URL = 'http://localhost:8001/execute';
  const SUBMISSION_API_URL = 'http://localhost:8000/api/submission';

  const languageTemplates = {
    javascript: `// ${problem?.title || 'Problem Title'}\n\nfunction solve() {\n  // Write your code here\n  console.log("Hello, JavaScript!");\n}\n\nsolve();`,
    python: `# ${problem?.title || 'Problem Title'}\n\ndef solve():\n  # Write your code here\n  print("Hello, Python!")\n\nsolve()`,
    java: `// ${problem?.title || 'Problem Title'}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        System.out.println("Hello, Java!");\n    }\n}`,
    cpp: `// ${problem?.title || 'Problem Title'}\n\n#include <iostream>\n\nvoid solve() {\n    // Write your code here\n    std::cout << "Hello, C++!" << std::endl;\n}\n\nint main() {\n    solve();\n    return 0;\n}`
  };

  useEffect(() => {
    if (problem) {
      setCode(languageTemplates[language] || '');
    }
  }, [problem, language]);
  
  // Function for the "Run Code" button (tests against custom input)
  const handleRunCode = async () => {
    setIsRunning(true);
    setRunOutput('');
    setActiveTab('runOutput');

    try {
      const response = await axios.post(JUDGE_SERVER_URL, {
        language: language,
        code: code,
        input: runInput,
      });
      if (response.data.error) {
        setRunOutput(response.data.error);
      } else {
        setRunOutput(response.data.output);
      }
    } catch (e) {
      setRunOutput("Failed to connect to the judge server.");
    } finally {
      setIsRunning(false);
    }
  };

  // Function for the "Submit" button (final judging)
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setSubmissionStatus('Submitting...');
    setSubmissionResult(null);
    setActiveTab('submission');

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(SUBMISSION_API_URL, {
            problem_id: problem.id,
            language: language,
            code: code,
            match_id: match?.match_id
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

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
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-pixel">
        <Loader className="w-8 h-8 animate-spin mr-4" />
        Waiting for a match...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 font-tech">
        <div className="flex h-[calc(100vh-2rem)] gap-4">

            {/* Left Panel: Problem Description */}
            <div className="w-1/3 bg-gray-900 rounded-lg p-6 border border-gray-800 flex flex-col">
                <h1 className="font-pixel text-2xl text-cyan-400 mb-4">{problem.title}</h1>
                <div className="text-sm text-gray-400 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                        problem.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                    }`}>{problem.difficulty}</span>
                </div>
                <div className="prose prose-invert prose-sm text-gray-300 overflow-y-auto flex-grow">
                    <p>{problem.description}</p>
                    {problem.constraints && <><h3>Constraints</h3><p>{problem.constraints}</p></>}
                </div>
            </div>

            {/* Right Panel: Editor and I/O */}
            <div className="w-2/3 flex flex-col gap-4">
                {/* Top: Editor */}
                <div className="bg-gray-900 rounded-lg border border-gray-800 flex-grow flex flex-col">
                    <div className="bg-gray-800 p-2 flex justify-between items-center">
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600"
                        >
                          <option value="python">Python</option>
                          <option value="javascript">JavaScript</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                        </select>
                        <div className="flex items-center gap-4">
                            <button onClick={handleRunCode} disabled={isRunning} className="flex items-center gap-2 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">
                                <Play className="w-4 h-4" /> Run
                            </button>
                            <button onClick={handleSubmitCode} disabled={isSubmitting} className="flex items-center gap-2 px-3 py-1 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50">
                                {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                                {isSubmitting ? 'Submitting' : 'Submit'}
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow p-2">
                        <Editor
                            height="100%"
                            language={language}
                            theme={'vs-dark'}
                            value={code}
                            onChange={(newValue) => setCode(newValue)}
                            options={{ minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true, fontSize: 14 }}
                        />
                    </div>
                </div>

                {/* Bottom: I/O and Submission Results */}
                <div className="bg-gray-900 rounded-lg border border-gray-800 h-1/3 flex flex-col">
                     <div className="flex border-b border-gray-800">
                        <button onClick={() => setActiveTab('runInput')} className={`flex-1 py-2 text-center text-sm ${activeTab === 'runInput' ? 'bg-gray-800' : ''}`}><FileText className="inline w-4 h-4 mr-1"/> Custom Input</button>
                        <button onClick={() => setActiveTab('runOutput')} className={`flex-1 py-2 text-center text-sm ${activeTab === 'runOutput' ? 'bg-gray-800' : ''}`}><Bug className="inline w-4 h-4 mr-1"/> Run Output</button>
                        <button onClick={() => setActiveTab('submission')} className={`flex-1 py-2 text-center text-sm ${activeTab === 'submission' ? 'bg-gray-800' : ''}`}><UploadCloud className="inline w-4 h-4 mr-1"/> Submission Result</button>
                    </div>
                    <div className="p-4 flex-grow overflow-y-auto font-mono text-sm">
                        {activeTab === 'runInput' && <textarea value={runInput} onChange={(e) => setRunInput(e.target.value)} className="w-full h-full bg-transparent text-white focus:outline-none resize-none" />}
                        {activeTab === 'runOutput' && <pre className="whitespace-pre-wrap">{runOutput || 'Run code to see output here.'}</pre>}
                        {activeTab === 'submission' && (
                            <div>
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
            </div>
        </div>
    </div>
  );
};

export default CodeEditor;
