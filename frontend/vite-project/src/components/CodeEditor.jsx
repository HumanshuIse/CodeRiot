import React, { useState, useEffect } from 'react';
import { Play, Settings, Copy, Download, RefreshCw, Code, Terminal, AlertCircle, CheckCircle, Clock, FileText, Zap, Bug } from 'lucide-react';
import Editor from '@monaco-editor/react'; // Import Monaco Editor

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [exitCode, setExitCode] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [activeTab, setActiveTab] = useState('output');
  const [testCases, setTestCases] = useState([]);
  const [autoComplete, setAutoComplete] = useState(true);

  // URL of your Judge Server
  const JUDGE_SERVER_URL = 'http://localhost:8001/execute';

  const languageTemplates = {
    javascript: `console.log("Hello, JavaScript!");\n// Write your JavaScript code here`,
    python: `print("Hello, Python!")\n# Write your Python code here`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n        // Write your Java code here\n    }\n}`,
    cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++!" << std::endl;\n    // Write your C++ code here\n    return 0;\n}`
  };

  useEffect(() => {
    setCode(languageTemplates[language] || '');
    setOutput('');
    setHasError(false);
    setErrorDetails(null);
  }, [language]);

  // --- THIS IS THE UPDATED FUNCTION ---
  const runCode = async () => {
    setIsRunning(true);
    setHasError(false);
    setErrorDetails(null);
    setOutput('');
    setExecutionTime(0);
    setMemoryUsage(0);
    setExitCode(null);
    setActiveTab('output'); // Switch to output tab on run

    try {
      const response = await fetch(JUDGE_SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language,
          code: code,
          input: input
        })
      });

      if (!response.ok) {
        // Handle HTTP errors (e.g., 500 Internal Server Error from the judge)
        const errorData = await response.json();
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
      }
      
      const result = await response.json();

      // Set state with results from the judge
      setExecutionTime(result.executionTime || 0);
      setMemoryUsage(result.memoryUsage || 0);
      setExitCode(result.exitCode);

      if (result.error) {
        // If there's a compilation or runtime error
        setHasError(true);
        setOutput(result.error);
        setErrorDetails({
            type: result.exitCode !== 0 ? "Runtime/Compilation Error" : "Error",
            message: result.error.split('\n')[0], // Show first line as summary
            details: result.error
        });
        setActiveTab('errors'); // Switch to errors tab
      } else {
        // If execution was successful
        setOutput(result.output);
      }

    } catch (e) {
      setHasError(true);
      const errorMessage = e.message || "An unexpected error occurred. Is the judge server running?";
      setOutput(errorMessage);
      setErrorDetails({
        type: "Connection Error",
        message: "Could not connect to the execution server.",
        details: errorMessage
      });
      setExitCode(1);
      setActiveTab('errors');
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
    };
    const element = document.createElement("a");
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `code_snippet.${extensions[language] || 'txt'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetCode = () => {
    setCode(languageTemplates[language] || '');
    setOutput('');
    setInput('');
    setExecutionTime(0);
    setMemoryUsage(0);
    setExitCode(null);
    setHasError(false);
    setErrorDetails(null);
    setTestCases([]);
  };

  useEffect(() => {
    setTestCases([
      { id: 1, input: "5", expectedOutput: "10", result: null, status: 'pending' },
      { id: 2, input: "10", expectedOutput: "20", result: null, status: 'pending' },
      { id: 3, input: "3", expectedOutput: "6", result: null, status: 'pending' },
    ]);
  }, []);

  const runTestCase = async (testId) => {
    // This function can also be updated to use the judge server
    // For now, it remains a simulation to keep the focus on the main "Run" button.
    console.log("Running test case:", testId);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 font-tech">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        .font-tech { font-family: 'Rajdhani', sans-serif; }
        @font-face {
          font-family: 'PressStart2P';
          src: url('/src/assets/fonts/PressStart2P.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        .font-pixel { font-family: 'PressStart2P', 'Courier New', monospace; }
      `}</style>
      <div className="max-w-7xl mx-auto rounded-lg shadow-lg overflow-hidden bg-gray-900 border border-gray-800">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
          <h1 className="text-xl font-pixel bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
            Code Editor
          </h1>
          <div className="flex items-center space-x-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Overlay */}
        {showSettings && (
          <div className="absolute inset-0 bg-black bg-opacity-70 z-20 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-96 font-tech">
              <h3 className="text-xl font-semibold mb-4 text-white">Settings</h3>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">Font Size:</label>
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center text-gray-300 text-sm">
                  <input
                    type="checkbox"
                    checked={lineNumbers}
                    onChange={(e) => setLineNumbers(e.target.checked)}
                    className="mr-2 form-checkbox text-blue-500 bg-gray-700 border-gray-600 rounded"
                  />
                  Show Line Numbers
                </label>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex flex-col md:flex-row h-[70vh]">
          {/* Code Input */}
          <div className="relative flex-1 bg-gray-950 px-4 pt-4 pb-4 border-r border-gray-800">
            <Editor
              height="100%"
              language={language}
              theme={'vs-dark'}
              value={code}
              onChange={(newValue) => setCode(newValue)}
              options={{
                fontSize: fontSize,
                lineNumbers: lineNumbers ? 'on' : 'off',
                minimap: { enabled: false },
                wordWrap: 'off',

                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
              }}
            />
          </div>

          {/* Input/Output/Errors Section */}
          <div className="flex-1 flex flex-col bg-gray-900">
            {/* Action Buttons */}
            <div className="p-4 flex items-center justify-between border-b border-gray-800">
              <div className="flex space-x-3">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>{isRunning ? 'Running...' : 'Run'}</span>
                </button>
                <button
                  onClick={resetCode}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Reset</span>
                </button>
              </div>
              <div className="flex space-x-3">
                <button onClick={copyCode} className="text-gray-400 hover:text-cyan-400 transition-colors"><Copy className="w-5 h-5" /></button>
                <button onClick={downloadCode} className="text-gray-400 hover:text-cyan-400 transition-colors"><Download className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Tabs for Output/Input/Test Cases/Errors */}
            <div className="flex border-b border-gray-800">
              <button
                onClick={() => setActiveTab('output')}
                className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${activeTab === 'output' ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <Terminal className="inline-block w-4 h-4 mr-1" /> Output
              </button>
              <button
                onClick={() => setActiveTab('input')}
                className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${activeTab === 'input' ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <FileText className="inline-block w-4 h-4 mr-1" /> Input
              </button>
               <button
                onClick={() => setActiveTab('errors')}
                className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${activeTab === 'errors' ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <Bug className="inline-block w-4 h-4 mr-1" /> Errors {hasError && <AlertCircle className="inline-block w-4 h-4 ml-1 text-red-500 animate-pulse" />}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-950 font-mono text-sm">
              {activeTab === 'output' && (
                <>
                  <pre className={`whitespace-pre-wrap ${hasError ? 'text-red-400' : 'text-green-400'}`}>
                    {output || (isRunning ? 'Executing...' : 'Run your code to see output.')}
                  </pre>
                  {exitCode !== null && (
                    <div className="mt-4 text-gray-400 font-sans">
                      <hr className="border-gray-700 my-2" />
                      <p>Status: <span className={exitCode === 0 ? 'text-green-400' : 'text-red-400'}>{exitCode === 0 ? 'Success' : 'Error'}</span> (Exit Code: {exitCode})</p>
                      {executionTime > 0 && <p>Execution Time: <span className="text-cyan-400">{executionTime} ms</span></p>}
                      {memoryUsage > 0 && <p>Memory Used: <span className="text-cyan-400">{memoryUsage} MB</span></p>}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'input' && (
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-full bg-gray-800 text-white p-2 rounded-lg focus:outline-none resize-none font-mono"
                  placeholder="Enter input for your code here..."
                />
              )}
              
              {activeTab === 'errors' && (
                 <pre className="whitespace-pre-wrap text-red-400">
                    {errorDetails ? errorDetails.details : "No errors to display."}
                 </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
