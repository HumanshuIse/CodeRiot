import React, { useState, useEffect } from 'react';
import { Play, Settings, Copy, Download, RefreshCw, Code, Terminal, AlertCircle, CheckCircle, Clock, FileText, Zap, Bug } from 'lucide-react';
import Editor from '@monaco-editor/react'; // Import Monaco Editor

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('dark'); // Keep this for future theme options
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  // Removed suggestions and showSuggestions states as Monaco handles them
  const [executionTime, setExecutionTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [exitCode, setExitCode] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [activeTab, setActiveTab] = useState('output');
  const [testCases, setTestCases] = useState([]);
  // Removed currentTestCase as it was not actively used in the provided logic for individual test runs
  const [autoComplete, setAutoComplete] = useState(true); // Keep if you want to use it to control Monaco's autocomplete (advanced)

  // Language templates for initial boilerplate code
  const languageTemplates = {
    javascript: `console.log("Hello, JavaScript!");\n// Write your JavaScript code here`,
    python: `print("Hello, Python!")\n# Write your Python code here`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n        // Write your Java code here\n    }\n}`,
    cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++!" << std::endl;\n    // Write your C++ code here\n    return 0;\n}`
  };

  // Set initial code and reset states when language changes
  useEffect(() => {
    // Only set template if the editor is empty or explicitly changing languages
    // This simple check prevents overwriting user's code if they've already typed
    if (code === '' || !languageTemplates[language] || code === languageTemplates[language]) {
        setCode(languageTemplates[language] || '');
    } else {
        // Option to add a confirmation dialog here if user's unsaved code exists
        // For now, it will simply replace if it detects the language change.
        setCode(languageTemplates[language] || '');
    }
    
    setOutput('');
    setHasError(false);
    setErrorDetails(null);
    // You might also want to reset test cases here if they are language-specific
    // For now, keeping the dummy test cases static.
  }, [language]); // Depend on language state

  // Dummy functions for demonstration
  const runCode = async () => {
    setIsRunning(true);
    setHasError(false);
    setErrorDetails(null);
    setOutput('');
    setExecutionTime(0);
    setMemoryUsage(0);
    setExitCode(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Basic simulation of code execution
      if (code.includes("error")) {
        setHasError(true);
        setErrorDetails({
          type: "Runtime Error",
          line: 5,
          column: 10,
          message: "Something went wrong!",
          details: "Detailed stack trace or error message would go here."
        });
        setOutput("Error during execution. Check the 'Errors' tab.");
        setExitCode(1);
      } else if (code.includes("infinite loop")) {
        setOutput("Execution timed out due to infinite loop.");
        setExitCode(1);
        setExecutionTime(5000); // Simulate timeout
      }
      else {
        setOutput(`Simulated output for ${language}:\n${code}\nInput: ${input}`);
        setExecutionTime(Math.floor(Math.random() * 500) + 50); // ms
        setMemoryUsage(Math.floor(Math.random() * 20) + 5); // MB
        setExitCode(0);
      }
    } catch (e) {
      setHasError(true);
      setErrorDetails({
        type: "Internal Error",
        message: e.message,
        details: e.stack
      });
      setOutput("An internal error occurred.");
      setExitCode(1);
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    // Add a toast notification later
  };

  const downloadCode = () => {
    const extensions = { // Expanded extensions for common languages
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c'
    };
    const element = document.createElement("a");
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `code_riot_snippet.${extensions[language] || 'txt'}`; // Fallback to .txt
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetCode = () => {
    // Reset to current language's boilerplate
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

  // Removed generateLineNumbers function as Monaco handles line numbers

  // Removed custom Autocomplete logic useEffect and selectSuggestion function as Monaco handles these

  // Test cases (dummy data)
  useEffect(() => {
    // You might want to make this language-specific in the future
    setTestCases([
      { id: 1, input: "5", expectedOutput: "10", result: null, status: 'pending' },
      { id: 2, input: "10", expectedOutput: "20", result: null, status: 'pending' },
      { id: 3, input: "3", expectedOutput: "6", result: null, status: 'pending' },
    ]);
  }, []);

  const runTestCase = async (testId) => {
    const testCaseToRun = testCases.find(tc => tc.id === testId);
    if (!testCaseToRun) return;

    // Simulate running with test case input
    setIsRunning(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

    let testOutput;
    let testStatus;
    // Simple logic for demonstration
    if (code.includes("return " + testCaseToRun.input + " * 2")) { // Example: check for a specific pattern
        testOutput = (parseInt(testCaseToRun.input) * 2).toString();
        testStatus = 'passed';
    } else {
        testOutput = "Simulated incorrect output"; // For other code or cases
        testStatus = 'failed';
    }

    setTestCases(prev => prev.map(tc =>
      tc.id === testId
        ? { ...tc, result: { output: testOutput, time: Math.floor(Math.random() * 100) + 10 }, status: testStatus }
        : tc
    ));
    setIsRunning(false);
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
        .pixel-border { border-image: linear-gradient(45deg, #00ffff, #ff00ff) 1; border-style: solid; border-width: 2px; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff; } 50% { box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; } }
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
              <div className="mb-4">
                <label className="flex items-center text-gray-300 text-sm">
                  <input
                    type="checkbox"
                    checked={autoComplete}
                    onChange={(e) => setAutoComplete(e.target.checked)}
                    className="mr-2 form-checkbox text-blue-500 bg-gray-700 border-gray-600 rounded"
                  />
                  Enable Autocomplete
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
              height="100%" // Make the editor fill the parent div's height
              language={
                language === 'javascript' ? 'javascript' :
                language === 'python' ? 'python' :
                language === 'java' ? 'java' :
                language === 'cpp' ? 'cpp' : // Monaco's language ID for C++
                'plaintext' // Fallback for unsupported languages
              }
              theme={theme === 'dark' ? 'vs-dark' : 'vs-light'} // Use Monaco's built-in themes
              value={code}
              onChange={(newValue) => setCode(newValue)}
              options={{
                fontSize: fontSize, // Use your fontSize state
                lineNumbers: lineNumbers ? 'on' : 'off', // Use your lineNumbers state to toggle Monaco's line numbers
                minimap: { enabled: false }, // Common setting for competitive programming
                wordWrap: 'off', // Can be 'on' if you want word wrap
                scrollBeyondLastLine: false, // Prevents extra scrolling space
                automaticLayout: true, // Ensures editor resizes correctly with parent
                tabSize: 4, // Set tab size
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
                onClick={() => setActiveTab('test-cases')}
                className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${activeTab === 'test-cases' ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <CheckCircle className="inline-block w-4 h-4 mr-1" /> Test Cases
              </button>
              <button
                onClick={() => setActiveTab('errors')}
                className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${activeTab === 'errors' ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <Bug className="inline-block w-4 h-4 mr-1" /> Errors {hasError && <AlertCircle className="inline-block w-4 h-4 ml-1 text-red-500 animate-pulse" />}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-950 font-pixel text-sm">
              {activeTab === 'output' && (
                <>
                  <pre className={`whitespace-pre-wrap ${output.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                    {output || (isRunning ? 'Executing...' : 'Run your code to see output.')}
                  </pre>
                  {exitCode !== null && (
                    <div className="mt-4 text-gray-400">
                      <p>Exit Code: <span className={exitCode === 0 ? 'text-green-400' : 'text-red-400'}>{exitCode}</span></p>
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

              {activeTab === 'test-cases' && (
                <div className="space-y-4">
                  {testCases.length === 0 ? (
                    <div className="text-gray-400">No test cases defined.</div>
                  ) : (
                    testCases.map((testCase, index) => (
                      <div key={testCase.id} className={`p-4 rounded-lg border ${testCase.status === 'passed' ? 'border-green-600 bg-green-900/20' : testCase.status === 'failed' ? 'border-red-600 bg-red-900/20' : 'border-gray-700 bg-gray-800'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-lg flex items-center">
                            Test Case {testCase.id}
                            {testCase.status === 'passed' && <CheckCircle className="w-5 h-5 text-green-400 ml-2" />}
                            {testCase.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-400 ml-2" />}
                            {testCase.status === 'pending' && <Clock className="w-5 h-5 text-gray-500 ml-2" />}
                          </h4>
                          <button
                            onClick={() => runTestCase(testCase.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
                            disabled={isRunning}
                          >
                            Run Test
                          </button>
                        </div>
                        <div className="text-sm text-gray-300 mb-1">Input: <span className="text-cyan-400">{testCase.input}</span></div>
                        <div className="text-sm text-gray-300 mb-1">Expected: <span className="text-orange-400">{testCase.expectedOutput}</span></div>
                        {testCase.result && (
                          <div className="text-sm text-gray-400">Output: {testCase.result.output}</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {activeTab === 'errors' && errorDetails && (
                <div className="text-red-400 space-y-2">
                  <div className="font-bold">Error Type: {errorDetails.type}</div>
                  <div>Line {errorDetails.line}, Column {errorDetails.column}</div>
                  <div className="text-red-300">Message: {errorDetails.message}</div>
                  <div className="mt-4 p-3 bg-red-900 bg-opacity-20 rounded border border-red-700">
                    <div className="text-sm">Details: {errorDetails.details}</div>
                  </div>
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