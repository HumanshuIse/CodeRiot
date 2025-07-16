// import React, { useState, useEffect, useRef } from 'react';
// import { Play, Settings, Copy, Download, RefreshCw, Code, Terminal, AlertCircle, CheckCircle, Clock, FileText, Eye, EyeOff, Zap, Bug } from 'lucide-react';

// const CodeEditor = () => {
//   const [code, setCode] = useState('');
//   const [language, setLanguage] = useState('javascript');
//   const [output, setOutput] = useState('');
//   const [input, setInput] = useState('');
//   const [isRunning, setIsRunning] = useState(false);
//   const [theme, setTheme] = useState('dark');
//   const [fontSize, setFontSize] = useState(14);
//   const [showSettings, setShowSettings] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [executionTime, setExecutionTime] = useState(0);
//   const [memoryUsage, setMemoryUsage] = useState(0);
//   const [exitCode, setExitCode] = useState(null);
//   const [hasError, setHasError] = useState(false);
//   const [errorDetails, setErrorDetails] = useState(null);
//   const [lineNumbers, setLineNumbers] = useState(true);
//   const [activeTab, setActiveTab] = useState('output');
//   const [testCases, setTestCases] = useState([]);
//   const [currentTestCase, setCurrentTestCase] = useState(0);
//   const [autoComplete, setAutoComplete] = useState(true);
//   const [wordWrap, setWordWrap] = useState(false);
  
//   const editorRef = useRef(null);
//   const textareaRef = useRef(null);

//   // Enhanced language templates with more complex examples
//   const languageTemplates = {
//     javascript: `// JavaScript - Array Sum Problem
// function arraySum(arr) {
//     return arr.reduce((sum, num) => sum + num, 0);
// }

// // Read input
// const input = [1, 2, 3, 4, 5];
// const result = arraySum(input);
// console.log("Sum:", result);

// // Test with different inputs
// console.log("Sum of [10, 20, 30]:", arraySum([10, 20, 30]));`,

//     python: `# Python - Fibonacci Sequence
// def fibonacci(n):
//     if n <= 1:
//         return n
    
//     a, b = 0, 1
//     for _ in range(2, n + 1):
//         a, b = b, a + b
//     return b

// # Read input
// n = int(input("Enter a number: ") or "10")
// print(f"Fibonacci({n}) = {fibonacci(n)}")

// # Print first n fibonacci numbers
// print("First", n, "fibonacci numbers:")
// for i in range(n):
//     print(fibonacci(i), end=" ")
// print()`,

//     java: `// Java - Prime Number Checker
// import java.util.Scanner;

// public class PrimeChecker {
//     public static boolean isPrime(int n) {
//         if (n <= 1) return false;
//         if (n <= 3) return true;
//         if (n % 2 == 0 || n % 3 == 0) return false;
        
//         for (int i = 5; i * i <= n; i += 6) {
//             if (n % i == 0 || n % (i + 2) == 0) {
//                 return false;
//             }
//         }
//         return true;
//     }
    
//     public static void main(String[] args) {
//         Scanner scanner = new Scanner(System.in);
//         System.out.print("Enter a number: ");
//         int num = scanner.nextInt();
        
//         if (isPrime(num)) {
//             System.out.println(num + " is a prime number");
//         } else {
//             System.out.println(num + " is not a prime number");
//         }
        
//         // Find primes up to num
//         System.out.println("Prime numbers up to " + num + ":");
//         for (int i = 2; i <= num; i++) {
//             if (isPrime(i)) {
//                 System.out.print(i + " ");
//             }
//         }
//         System.out.println();
//     }
// }`,

//     cpp: `// C++ - Binary Search Implementation
// #include <iostream>
// #include <vector>
// #include <algorithm>

// int binarySearch(const std::vector<int>& arr, int target) {
//     int left = 0, right = arr.size() - 1;
    
//     while (left <= right) {
//         int mid = left + (right - left) / 2;
        
//         if (arr[mid] == target) {
//             return mid;
//         } else if (arr[mid] < target) {
//             left = mid + 1;
//         } else {
//             right = mid - 1;
//         }
//     }
//     return -1;
// }

// int main() {
//     std::vector<int> arr = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19};
//     int target = 7;
    
//     std::cout << "Array: ";
//     for (int num : arr) {
//         std::cout << num << " ";
//     }
//     std::cout << std::endl;
    
//     int result = binarySearch(arr, target);
//     if (result != -1) {
//         std::cout << "Element " << target << " found at index " << result << std::endl;
//     } else {
//         std::cout << "Element " << target << " not found" << std::endl;
//     }
    
//     return 0;
// }`,

//     c: `// C - Sorting Algorithm (Bubble Sort)
// #include <stdio.h>

// void bubbleSort(int arr[], int n) {
//     for (int i = 0; i < n - 1; i++) {
//         for (int j = 0; j < n - i - 1; j++) {
//             if (arr[j] > arr[j + 1]) {
//                 // Swap elements
//                 int temp = arr[j];
//                 arr[j] = arr[j + 1];
//                 arr[j + 1] = temp;
//             }
//         }
//     }
// }

// int main() {
//     int arr[] = {64, 34, 25, 12, 22, 11, 90};
//     int n = sizeof(arr) / sizeof(arr[0]);
    
//     printf("Original array: ");
//     for (int i = 0; i < n; i++) {
//         printf("%d ", arr[i]);
//     }
//     printf("\\n");
    
//     bubbleSort(arr, n);
    
//     printf("Sorted array: ");
//     for (int i = 0; i < n; i++) {
//         printf("%d ", arr[i]);
//     }
//     printf("\\n");
    
//     return 0;
// }`
//   };

//   // Enhanced syntax keywords
//   const languageKeywords = {
//     javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'async', 'await', 'try', 'catch', 'finally', 'console', 'document', 'window', 'Array', 'Object', 'String', 'Number', 'Boolean', 'null', 'undefined', 'true', 'false', 'this', 'new', 'typeof', 'instanceof', 'in', 'of', 'switch', 'case', 'default', 'break', 'continue'],
//     python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'try', 'except', 'finally', 'with', 'as', 'print', 'input', 'len', 'range', 'enumerate', 'zip', 'map', 'filter', 'lambda', 'list', 'dict', 'tuple', 'set', 'str', 'int', 'float', 'bool', 'None', 'True', 'False', 'and', 'or', 'not', 'is', 'in', 'pass', 'break', 'continue'],
//     java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'abstract', 'if', 'else', 'for', 'while', 'return', 'try', 'catch', 'finally', 'System', 'String', 'int', 'double', 'boolean', 'char', 'byte', 'short', 'long', 'float', 'void', 'null', 'true', 'false', 'this', 'super', 'new', 'instanceof', 'switch', 'case', 'default', 'break', 'continue'],
//     cpp: ['#include', 'using', 'namespace', 'int', 'double', 'char', 'bool', 'void', 'if', 'else', 'for', 'while', 'return', 'class', 'struct', 'public', 'private', 'protected', 'cout', 'cin', 'endl', 'std', 'vector', 'string', 'const', 'static', 'virtual', 'override', 'nullptr', 'true', 'false', 'this', 'new', 'delete', 'sizeof', 'typedef', 'enum', 'union', 'switch', 'case', 'default', 'break', 'continue'],
//     c: ['#include', 'int', 'double', 'char', 'float', 'void', 'if', 'else', 'for', 'while', 'return', 'struct', 'union', 'enum', 'typedef', 'const', 'static', 'extern', 'register', 'auto', 'volatile', 'signed', 'unsigned', 'short', 'long', 'printf', 'scanf', 'malloc', 'free', 'NULL', 'sizeof', 'switch', 'case', 'default', 'break', 'continue']
//   };

//   // Sample test cases
//   const sampleTestCases = {
//     javascript: [
//       { input: '[1, 2, 3, 4, 5]', expectedOutput: 'Sum: 15' },
//       { input: '[10, 20, 30]', expectedOutput: 'Sum: 60' }
//     ],
//     python: [
//       { input: '10', expectedOutput: 'Fibonacci(10) = 55' },
//       { input: '5', expectedOutput: 'Fibonacci(5) = 5' }
//     ],
//     java: [
//       { input: '17', expectedOutput: '17 is a prime number' },
//       { input: '4', expectedOutput: '4 is not a prime number' }
//     ],
//     cpp: [
//       { input: '', expectedOutput: 'Element 7 found at index 3' }
//     ],
//     c: [
//       { input: '', expectedOutput: 'Sorted array: 11 12 22 25 34 64 90' }
//     ]
//   };

//   // Initialize with template and test cases
//   useEffect(() => {
//     setCode(languageTemplates[language] || '');
//     setTestCases(sampleTestCases[language] || []);
//     setCurrentTestCase(0);
//     setOutput('');
//     setHasError(false);
//     setErrorDetails(null);
//   }, [language]);

//   // Advanced code execution simulation
//   const executeCode = async (inputData = '') => {
//     const startTime = Date.now();
    
//     try {
//       // Simulate compilation time
//       await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
//       // Simulate syntax/runtime errors randomly for demonstration
//       const errorChance = Math.random();
//       if (errorChance < 0.15) { // 15% chance of error
//         throw new Error('Compilation Error');
//       }
      
//       // Simulate different types of outputs based on code content
//       let result = '';
//       let hasRuntimeError = false;
      
//       if (code.includes('error') || code.includes('throw')) {
//         hasRuntimeError = true;
//         throw new Error('Runtime Error: Exception thrown during execution');
//       }
      
//       // Language-specific execution simulation
//       switch (language) {
//         case 'javascript':
//           if (code.includes('arraySum')) {
//             result = 'Sum: 15\nSum of [10, 20, 30]: 60';
//           } else if (code.includes('console.log')) {
//             result = 'Output generated successfully';
//           } else {
//             result = 'JavaScript code executed';
//           }
//           break;
          
//         case 'python':
//           if (code.includes('fibonacci')) {
//             const n = inputData || '10';
//             result = `Enter a number: ${n}\nFibonacci(${n}) = ${fibonacci(parseInt(n))}\nFirst ${n} fibonacci numbers:\n${Array.from({length: parseInt(n)}, (_, i) => fibonacci(i)).join(' ')}`;
//           } else if (code.includes('print')) {
//             result = 'Python output generated';
//           } else {
//             result = 'Python code executed';
//           }
//           break;
          
//         case 'java':
//           if (code.includes('isPrime')) {
//             const num = inputData || '17';
//             const isPrimeNum = isPrime(parseInt(num));
//             result = `Enter a number: ${num}\n${num} is ${isPrimeNum ? 'a' : 'not a'} prime number\nPrime numbers up to ${num}:\n${getPrimesUpTo(parseInt(num)).join(' ')}`;
//           } else {
//             result = 'Java program executed successfully';
//           }
//           break;
          
//         case 'cpp':
//           if (code.includes('binarySearch')) {
//             result = 'Array: 1 3 5 7 9 11 13 15 17 19\nElement 7 found at index 3';
//           } else {
//             result = 'C++ program executed successfully';
//           }
//           break;
          
//         case 'c':
//           if (code.includes('bubbleSort')) {
//             result = 'Original array: 64 34 25 12 22 11 90\nSorted array: 11 12 22 25 34 64 90';
//           } else {
//             result = 'C program executed successfully';
//           }
//           break;
          
//         default:
//           result = 'Code executed successfully';
//       }
      
//       const endTime = Date.now();
//       setExecutionTime(endTime - startTime);
//       setMemoryUsage(Math.floor(Math.random() * 50) + 10); // Random memory usage
//       setExitCode(0);
//       setHasError(false);
//       setErrorDetails(null);
      
//       return result;
      
//     } catch (error) {
//       const endTime = Date.now();
//       setExecutionTime(endTime - startTime);
//       setMemoryUsage(0);
//       setExitCode(1);
//       setHasError(true);
      
//       // Generate detailed error information
//       const errorTypes = ['SyntaxError', 'RuntimeError', 'CompileError', 'MemoryError'];
//       const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
//       const lineNumber = Math.floor(Math.random() * 20) + 1;
      
//       setErrorDetails({
//         type: errorType,
//         message: error.message,
//         line: lineNumber,
//         column: Math.floor(Math.random() * 30) + 1,
//         details: `${errorType} at line ${lineNumber}: ${error.message}`
//       });
      
//       throw error;
//     }
//   };

//   // Helper functions for simulation
//   const fibonacci = (n) => {
//     if (n <= 1) return n;
//     let a = 0, b = 1;
//     for (let i = 2; i <= n; i++) {
//       [a, b] = [b, a + b];
//     }
//     return b;
//   };

//   const isPrime = (n) => {
//     if (n <= 1) return false;
//     if (n <= 3) return true;
//     if (n % 2 === 0 || n % 3 === 0) return false;
//     for (let i = 5; i * i <= n; i += 6) {
//       if (n % i === 0 || n % (i + 2) === 0) return false;
//     }
//     return true;
//   };

//   const getPrimesUpTo = (n) => {
//     const primes = [];
//     for (let i = 2; i <= n; i++) {
//       if (isPrime(i)) primes.push(i);
//     }
//     return primes;
//   };

//   // Enhanced code change handler
//   const handleCodeChange = (e) => {
//     const value = e.target.value;
//     setCode(value);
    
//     if (autoComplete) {
//       const cursorPos = e.target.selectionStart;
//       const beforeCursor = value.substring(0, cursorPos);
//       const words = beforeCursor.split(/\s+/);
//       const currentWord = words[words.length - 1];
      
//       if (currentWord.length > 1) {
//         const matchingKeywords = languageKeywords[language]?.filter(keyword => 
//           keyword.toLowerCase().startsWith(currentWord.toLowerCase())
//         ) || [];
//         setSuggestions(matchingKeywords);
//         setShowSuggestions(matchingKeywords.length > 0);
//       } else {
//         setShowSuggestions(false);
//       }
//     }
//   };

//   // Run code with proper error handling
//   const runCode = async () => {
//     setIsRunning(true);
//     setOutput('Compiling and executing...');
//     setActiveTab('output');
    
//     try {
//       const result = await executeCode(input);
//       setOutput(result);
//     } catch (error) {
//       setOutput(`Error: ${error.message}`);
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   // Run test cases
//   const runTestCases = async () => {
//     if (testCases.length === 0) return;
    
//     setIsRunning(true);
//     setActiveTab('tests');
    
//     const results = [];
//     for (let i = 0; i < testCases.length; i++) {
//       try {
//         const result = await executeCode(testCases[i].input);
//         results.push({
//           passed: result.includes(testCases[i].expectedOutput),
//           output: result,
//           expected: testCases[i].expectedOutput
//         });
//       } catch (error) {
//         results.push({
//           passed: false,
//           output: error.message,
//           expected: testCases[i].expectedOutput
//         });
//       }
//     }
    
//     setTestCases(testCases.map((tc, i) => ({ ...tc, result: results[i] })));
//     setIsRunning(false);
//   };

//   // Copy code to clipboard
//   const copyCode = () => {
//     navigator.clipboard.writeText(code);
//     setOutput('Code copied to clipboard!');
//   };

//   // Download code as file
//   const downloadCode = () => {
//     const extensions = { 
//       javascript: 'js', 
//       python: 'py', 
//       java: 'java', 
//       cpp: 'cpp',
//       c: 'c'
//     };
//     const blob = new Blob([code], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `code.${extensions[language]}`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // Enhanced keyboard shortcuts
//   const handleKeyDown = (e) => {
//     if (e.ctrlKey || e.metaKey) {
//       switch (e.key) {
//         case 'Enter':
//           e.preventDefault();
//           runCode();
//           break;
//         case 's':
//           e.preventDefault();
//           downloadCode();
//           break;
//         case '/':
//           e.preventDefault();
//           // Toggle comment
//           break;
//       }
//     }
    
//     if (e.key === 'Tab') {
//       e.preventDefault();
//       const start = e.target.selectionStart;
//       const end = e.target.selectionEnd;
//       const newCode = code.substring(0, start) + '    ' + code.substring(end);
//       setCode(newCode);
//       setTimeout(() => {
//         e.target.selectionStart = e.target.selectionEnd = start + 4;
//       }, 0);
//     }
//   };

//   // Generate line numbers
//   const generateLineNumbers = () => {
//     const lines = code.split('\n');
//     return lines.map((_, index) => (
//       <div key={index} className={`text-right pr-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
//         {index + 1}
//       </div>
//     ));
//   };

//   return (
//     <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
//       {/* Header */}
//       <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <Code className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
//                 <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                   Advanced Code Editor
//                 </h1>
//               </div>
              
//               <select
//                 value={language}
//                 onChange={(e) => setLanguage(e.target.value)}
//                 className={`px-3 py-2 rounded-lg border ${
//                   theme === 'dark'
//                     ? 'bg-gray-700 border-gray-600 text-white'
//                     : 'bg-white border-gray-300 text-gray-900'
//                 } focus:outline-none focus:ring-2 focus:ring-blue-500`}
//               >
//                 <option value="javascript">JavaScript</option>
//                 <option value="python">Python</option>
//                 <option value="java">Java</option>
//                 <option value="cpp">C++</option>
//                 <option value="c">C</option>
//               </select>
//             </div>

//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={runCode}
//                 disabled={isRunning}
//                 className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 {isRunning ? (
//                   <RefreshCw className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <Play className="w-4 h-4" />
//                 )}
//                 <span>{isRunning ? 'Running' : 'Run'}</span>
//               </button>
              
//               <button
//                 onClick={runTestCases}
//                 disabled={isRunning || testCases.length === 0}
//                 className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <Zap className="w-4 h-4" />
//                 <span>Test</span>
//               </button>
              
//               <button
//                 onClick={copyCode}
//                 className={`p-2 rounded-lg ${
//                   theme === 'dark'
//                     ? 'bg-gray-700 text-white hover:bg-gray-600'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 } transition-colors`}
//               >
//                 <Copy className="w-4 h-4" />
//               </button>
              
//               <button
//                 onClick={downloadCode}
//                 className={`p-2 rounded-lg ${
//                   theme === 'dark'
//                     ? 'bg-gray-700 text-white hover:bg-gray-600'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 } transition-colors`}
//               >
//                 <Download className="w-4 h-4" />
//               </button>
              
//               <button
//                 onClick={() => setShowSettings(!showSettings)}
//                 className={`p-2 rounded-lg ${
//                   theme === 'dark'
//                     ? 'bg-gray-700 text-white hover:bg-gray-600'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 } transition-colors`}
//               >
//                 <Settings className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Settings Panel */}
//       {showSettings && (
//         <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="flex items-center space-x-2">
//                 <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                   Theme:
//                 </label>
//                 <select
//                   value={theme}
//                   onChange={(e) => setTheme(e.target.value)}
//                   className={`px-3 py-1 rounded border ${
//                     theme === 'dark'
//                       ? 'bg-gray-700 border-gray-600 text-white'
//                       : 'bg-white border-gray-300 text-gray-900'
//                   } focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                 >
//                   <option value="dark">Dark</option>
//                   <option value="light">Light</option>
//                 </select>
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                   Font Size:
//                 </label>
//                 <input
//                   type="range"
//                   min="12"
//                   max="20"
//                   value={fontSize}
//                   onChange={(e) => setFontSize(e.target.value)}
//                   className="w-20"
//                 />
//                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
//                   {fontSize}px
//                 </span>
//               </div>
              
//               <div className="flex items-center space-x-4">
//                 <label className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={lineNumbers}
//                     onChange={(e) => setLineNumbers(e.target.checked)}
//                     className="rounded"
//                   />
//                   <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                     Line Numbers
//                   </span>
//                 </label>
                
//                 <label className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={autoComplete}
//                     onChange={(e) => setAutoComplete(e.target.checked)}
//                     className="rounded"
//                   />
//                   <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                     Auto Complete
//                   </span>
//                 </label>
                
//                 <label className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={wordWrap}
//                     onChange={(e) => setWordWrap(e.target.checked)}
//                     className="rounded"
//                   />
//                   <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                     Word Wrap
//                   </span>
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Editor Area */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Code Editor */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                 Editor
//               </h2>
//               <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//                 Ctrl+Enter to run • Ctrl+S to save • Tab for indent
//               </div>
//             </div>
            
//             <div className="relative">
//               <div className="flex">
//                 {lineNumbers && (
//                   <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} px-2 py-4 font-mono text-sm border-r ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
//                     {generateLineNumbers()}
//                   </div>
//                 )}
                
//                 <textarea
//                   ref={textareaRef}
//                   value={code}
//                   onChange={handleCodeChange}
//                   onKeyDown={handleKeyDown}
//                   className={`flex-1 h-96 p-4 font-mono resize-none ${
//                     theme === 'dark'
//                       ? 'bg-gray-800 text-white'
//                       : 'bg-white text-gray-900'
//                   } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'
//                   }`}
//                   style={{ fontSize: `${fontSize}px` }}
//                   placeholder="Start coding..."
//                   spellCheck="false"
//                 />
                
//                 {/* Autocompletion Suggestions */}
//                 {showSuggestions && (
//                   <div className={`absolute z-10 mt-1 w-48 ${
//                     theme === 'dark' ? 'bg-gray-700' : 'bg-white'
//                   } border ${
//                     theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
//                   } rounded-lg shadow-lg max-h-40 overflow-y-auto`}>
//                     {suggestions.map((suggestion, index) => (
//                       <button
//                         key={index}
//                         onClick={() => selectSuggestion(suggestion)}
//                         className={`w-full px-3 py-2 text-left hover:${
//                           theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
//                         } ${theme === 'dark' ? 'text-white' : 'text-gray-900'} transition-colors`}
//                       >
//                         {suggestion}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Input Section */}
//             <div>
//               <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
//                 Input (optional)
//               </label>
//               <textarea
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 className={`w-full h-20 p-3 rounded-lg border ${
//                   theme === 'dark'
//                     ? 'bg-gray-800 border-gray-700 text-white'
//                     : 'bg-white border-gray-300 text-gray-900'
//                 } focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                 placeholder="Enter input for your program..."
//               />
//             </div>
//           </div>

//           {/* Output Panel */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <Terminal className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
//                 <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                   Output
//                 </h2>
//               </div>
              
//               {/* Execution Stats */}
//               {executionTime > 0 && (
//                 <div className="flex items-center space-x-4 text-sm">
//                   <div className={`flex items-center space-x-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//                     <Clock className="w-4 h-4" />
//                     <span>{executionTime}ms</span>
//                   </div>
//                   <div className={`flex items-center space-x-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//                     <span>Memory: {memoryUsage}KB</span>
//                   </div>
//                   <div className={`flex items-center space-x-1 ${
//                     exitCode === 0 ? 'text-green-500' : 'text-red-500'
//                   }`}>
//                     {exitCode === 0 ? (
//                       <CheckCircle className="w-4 h-4" />
//                     ) : (
//                       <AlertCircle className="w-4 h-4" />
//                     )}
//                     <span>Exit {exitCode}</span>
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             {/* Output Tabs */}
//             <div className="flex space-x-1">
//               <button
//                 onClick={() => setActiveTab('output')}
//                 className={`px-3 py-1 rounded-t-lg text-sm font-medium ${
//                   activeTab === 'output'
//                     ? theme === 'dark'
//                       ? 'bg-gray-800 text-white'
//                       : 'bg-white text-gray-900 border-b-2 border-blue-500'
//                     : theme === 'dark'
//                       ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 } transition-colors`}
//               >
//                 Output
//               </button>
//               <button
//                 onClick={() => setActiveTab('tests')}
//                 className={`px-3 py-1 rounded-t-lg text-sm font-medium ${
//                   activeTab === 'tests'
//                     ? theme === 'dark'
//                       ? 'bg-gray-800 text-white'
//                       : 'bg-white text-gray-900 border-b-2 border-blue-500'
//                     : theme === 'dark'
//                       ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 } transition-colors`}
//               >
//                 Tests ({testCases.length})
//               </button>
//               {hasError && (
//                 <button
//                   onClick={() => setActiveTab('errors')}
//                   className={`px-3 py-1 rounded-t-lg text-sm font-medium ${
//                     activeTab === 'errors'
//                       ? theme === 'dark'
//                         ? 'bg-gray-800 text-white'
//                         : 'bg-white text-gray-900 border-b-2 border-red-500'
//                       : 'bg-red-100 text-red-600 hover:bg-red-200'
//                   } transition-colors`}
//                 >
//                   <Bug className="w-4 h-4 inline mr-1" />
//                   Errors
//                 </button>
//               )}
//             </div>
            
//             {/* Output Content */}
//             <div className={`h-96 p-4 rounded-lg border ${
//               theme === 'dark'
//                 ? 'bg-gray-800 border-gray-700'
//                 : 'bg-gray-900 border-gray-300'
//             } font-mono text-sm overflow-y-auto`}>
//               {activeTab === 'output' && (
//                 <pre className={`whitespace-pre-wrap ${
//                   hasError ? 'text-red-400' : 'text-green-400'
//                 }`}>
//                   {output || 'Click "Run" to execute your code...'}
//                 </pre>
//               )}
              
//               {activeTab === 'tests' && (
//                 <div className="space-y-3">
//                   {testCases.length === 0 ? (
//                     <div className="text-gray-400">No test cases available</div>
//                   ) : (
//                     testCases.map((testCase, index) => (
//                       <div key={index} className={`p-3 rounded border ${
//                         theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
//                       }`}>
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="text-gray-300">Test Case {index + 1}</span>
//                           {testCase.result && (
//                             <span className={`flex items-center space-x-1 ${
//                               testCase.result.passed ? 'text-green-400' : 'text-red-400'
//                             }`}>
//                               {testCase.result.passed ? (
//                                 <CheckCircle className="w-4 h-4" />
//                               ) : (
//                                 <AlertCircle className="w-4 h-4" />
//                               )}
//                               <span>{testCase.result.passed ? 'PASSED' : 'FAILED'}</span>
//                             </span>
//                           )}
//                         </div>
//                         <div className="text-sm text-gray-400 mb-1">Input: {testCase.input || 'None'}</div>
//                         <div className="text-sm text-gray-400 mb-1">Expected: {testCase.expectedOutput}</div>
//                         {testCase.result && (
//                           <div className="text-sm text-gray-400">Output: {testCase.result.output}</div>
//                         )}
//                       </div>
//                     ))
//                   )}
//                 </div>
//               )}
              
//               {activeTab === 'errors' && errorDetails && (
//                 <div className="text-red-400 space-y-2">
//                   <div className="font-bold">{errorDetails.type}</div>
//                   <div>Line {errorDetails.line}, Column {errorDetails.column}</div>
//                   <div className="text-red-300">{errorDetails.message}</div>
//                   <div className="mt-4 p-3 bg-red-900 bg-opacity-20 rounded border border-red-700">
//                     <div className="text-sm">{errorDetails.details}</div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper function to select suggestion
// const selectSuggestion = (suggestion) => {
//   const textarea = textareaRef.current;
//   const cursorPos = textarea.selectionStart;
//   const beforeCursor = code.substring(0, cursorPos);
//   const afterCursor = code.substring(cursorPos);
  
//   const words = beforeCursor.split(/\s+/);
//   const currentWord = words[words.length - 1];
  
//   const newCode = beforeCursor.substring(0, beforeCursor.length - currentWord.length) + suggestion + afterCursor;
//   setCode(newCode);
//   setShowSuggestions(false);
// };

// export default CodeEditor;
import React, { useState, useEffect, useRef } from 'react';
import { Play, Settings, Copy, Download, RefreshCw, Code, Terminal, AlertCircle, CheckCircle, Clock, FileText, Eye, EyeOff, Zap, Bug } from 'lucide-react';

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('dark'); // Keep this for future theme options
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [exitCode, setExitCode] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [activeTab, setActiveTab] = useState('output');
  const [testCases, setTestCases] = useState([]);
  const [currentTestCase, setCurrentTestCase] = useState(0);
  const [autoComplete, setAutoComplete] = useState(true);

  const textareaRef = useRef(null);

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
    const element = document.createElement("a");
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `code_riot_snippet.${language === 'python' ? 'py' : 'js'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetCode = () => {
    setCode('');
    setOutput('');
    setInput('');
    setExecutionTime(0);
    setMemoryUsage(0);
    setExitCode(null);
    setHasError(false);
    setErrorDetails(null);
    setTestCases([]);
    setCurrentTestCase(0);
  };

  // Helper function to generate line numbers
  const generateLineNumbers = () => {
    const lines = code.split('\n');
    return lines.map((_, index) => index + 1).join('\n');
  };

  // Autocomplete logic
  useEffect(() => {
    if (!autoComplete || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const beforeCursor = code.substring(0, cursorPos);
    const lastWord = beforeCursor.split(/[\s.()\[\]{}'"`]/).pop();

    if (lastWord.length > 1) {
      const predefinedSuggestions = [
        "console.log", "function", "if", "else", "for", "while", "return",
        "class", "const", "let", "var", "import", "export", "try", "catch", "finally",
        "await", "async", "fetch", "map", "filter", "reduce", "this", "super",
        "Promise", "setTimeout", "setInterval", "clearTimeout", "clearInterval",
        "document.getElementById", "addEventListener", "removeEventListener",
        "Array", "Object", "String", "Number", "Boolean", "null", "undefined",
        "true", "false"
      ];
      const filteredSuggestions = predefinedSuggestions.filter(s =>
        s.startsWith(lastWord) && s !== lastWord
      ).slice(0, 5); // Limit suggestions

      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [code, autoComplete]);

  const selectSuggestion = (suggestion) => {
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const beforeCursor = code.substring(0, cursorPos);
    const afterCursor = code.substring(cursorPos);
    
    const words = beforeCursor.split(/[\s.()\[\]{}'"`]/);
    const currentWord = words[words.length - 1];
    
    const newCode = beforeCursor.substring(0, beforeCursor.length - currentWord.length) + suggestion + afterCursor;
    setCode(newCode);
    setShowSuggestions(false);
    
    // Move cursor to the end of the inserted suggestion
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = beforeCursor.length - currentWord.length + suggestion.length;
    }, 0);
  };

  // Test cases (dummy data)
  useEffect(() => {
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
    <div className="min-h-screen bg-black text-white p-4 font-tech"> {/* Added font-tech */}
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
          <div className="relative flex-1 bg-gray-950 p-4 border-r border-gray-800">
            {lineNumbers && (
              <div className="absolute left-0 top-0 bottom-0 py-4 px-3 bg-gray-900 text-gray-500 text-sm select-none font-mono" style={{ fontSize: `${fontSize}px` }}>
                {generateLineNumbers()}
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ fontSize: `${fontSize}px`, paddingLeft: lineNumbers ? '40px' : '0' }}
              className={`w-full h-full bg-transparent text-white focus:outline-none resize-none font-mono leading-relaxed ${lineNumbers ? 'pl-10' : ''}`}
              placeholder={`Write your ${language} code here...`}
              spellCheck="false"
            />
            {showSuggestions && (
              <div className="absolute bottom-2 left-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 p-2 max-h-32 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => selectSuggestion(s)}
                    className="cursor-pointer px-3 py-1 text-gray-300 hover:bg-gray-700 hover:text-white rounded text-sm"
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
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
            <div className="flex-1 p-4 overflow-y-auto bg-gray-950 font-pixel text-sm"> {/* Added font-pixel */}
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