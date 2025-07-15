import React, { useState, useEffect, useRef } from 'react';
import { Play, Settings, Copy, Download, RefreshCw, Code, Terminal } from 'lucide-react';

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, column: 0 });
  
  const editorRef = useRef(null);
  const textareaRef = useRef(null);

  // Language templates and snippets
  const languageTemplates = {
    javascript: `// JavaScript Code
function hello() {
    console.log("Hello, World!");
}

hello();`,
    python: `# Python Code
def hello():
    print("Hello, World!")

hello()`,
    java: `// Java Code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    cpp: `// C++ Code
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`
  };

  // Syntax keywords for different languages
  const languageKeywords = {
    javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'async', 'await', 'try', 'catch', 'finally', 'console', 'document', 'window'],
    python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'try', 'except', 'finally', 'with', 'as', 'print', 'input', 'len', 'range', 'enumerate'],
    java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'abstract', 'if', 'else', 'for', 'while', 'return', 'try', 'catch', 'finally', 'System', 'String', 'int', 'double', 'boolean'],
    cpp: ['#include', 'using', 'namespace', 'int', 'double', 'char', 'bool', 'void', 'if', 'else', 'for', 'while', 'return', 'class', 'struct', 'public', 'private', 'protected', 'cout', 'cin', 'endl', 'std']
  };

  // Initialize with template
  useEffect(() => {
    setCode(languageTemplates[language]);
  }, [language]);

  // Handle code change and autocompletion
  const handleCodeChange = (e) => {
    const value = e.target.value;
    setCode(value);
    
    // Get current word for autocompletion
    const cursorPos = e.target.selectionStart;
    const beforeCursor = value.substring(0, cursorPos);
    const words = beforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1];
    
    if (currentWord.length > 1) {
      const matchingKeywords = languageKeywords[language].filter(keyword => 
        keyword.toLowerCase().startsWith(currentWord.toLowerCase())
      );
      setSuggestions(matchingKeywords);
      setShowSuggestions(matchingKeywords.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const selectSuggestion = (suggestion) => {
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const beforeCursor = code.substring(0, cursorPos);
    const afterCursor = code.substring(cursorPos);
    
    const words = beforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1];
    
    const newCode = beforeCursor.substring(0, beforeCursor.length - currentWord.length) + suggestion + afterCursor;
    setCode(newCode);
    setShowSuggestions(false);
  };

  // Simulate code execution
  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running...');
    
    try {
      // Simulate API call to execute code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock execution results based on language
      let mockOutput = '';
      switch (language) {
        case 'javascript':
          mockOutput = 'Hello, World!\n';
          break;
        case 'python':
          mockOutput = 'Hello, World!\n';
          break;
        case 'java':
          mockOutput = 'Hello, World!\n';
          break;
        case 'cpp':
          mockOutput = 'Hello, World!\n';
          break;
        default:
          mockOutput = 'Code executed successfully!\n';
      }
      
      if (input.trim()) {
        mockOutput += `Input processed: ${input}\n`;
      }
      
      setOutput(mockOutput);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setOutput('Code copied to clipboard!');
  };

  // Download code as file
  const downloadCode = () => {
    const extensions = { javascript: 'js', python: 'py', java: 'java', cpp: 'cpp' };
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extensions[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          runCode();
          break;
        case 's':
          e.preventDefault();
          downloadCode();
          break;
      }
    }
    
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Code className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Code Editor
                </h1>
              </div>
              
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRunning ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{isRunning ? 'Running' : 'Run'}</span>
              </button>
              
              <button
                onClick={copyCode}
                className={`p-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
              >
                <Copy className="w-4 h-4" />
              </button>
              
              <button
                onClick={downloadCode}
                className={`p-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
              >
                <Download className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Theme:
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className={`px-3 py-1 rounded border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Font Size:
                </label>
                <input
                  type="range"
                  min="12"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-20"
                />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {fontSize}px
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Editor
              </h2>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Ctrl+Enter to run • Tab for indent
              </div>
            </div>
            
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={handleCodeChange}
                onKeyDown={handleKeyDown}
                className={`w-full h-96 p-4 rounded-lg border font-mono resize-none ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                style={{ fontSize: `${fontSize}px` }}
                placeholder="Start coding..."
                spellCheck="false"
              />
              
              {/* Autocompletion Suggestions */}
              {showSuggestions && (
                <div className={`absolute z-10 mt-1 w-48 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                } border ${
                  theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                } rounded-lg shadow-lg max-h-40 overflow-y-auto`}>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className={`w-full px-3 py-2 text-left hover:${
                        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                      } ${theme === 'dark' ? 'text-white' : 'text-gray-900'} transition-colors`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input Section */}
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                Input (optional)
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`w-full h-20 p-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter input for your program..."
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Terminal className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Output
              </h2>
            </div>
            
            <div className={`h-96 p-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-green-400'
                : 'bg-gray-900 border-gray-300 text-green-300'
            } font-mono text-sm overflow-y-auto`}>
              <pre className="whitespace-pre-wrap">
                {output || 'Click "Run" to execute your code...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;