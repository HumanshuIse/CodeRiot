import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProblemSubmissionForm = ({ onToast }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    tags: [],
    tagInput: '',
    constraints: '',
    // MODIFIED: test_cases is now a simple array.
    test_cases: [{ input: '', expected_output: '' }],
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const classNames = {
    button: "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 font-tech font-semibold text-base rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105",
    input: "flex h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 font-tech",
    label: "text-sm font-semibold text-gray-300 mb-1 font-tech",
    select: "flex h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 font-tech",
    textarea: "flex min-h-[80px] w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 font-tech",
    h3: "text-xl font-pixel text-cyan-400 mb-4",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // MODIFIED: Simplified test case handler
  const handleTestCaseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCases = [...formData.test_cases];
    updatedCases[index] = { ...updatedCases[index], [name]: value };
    setFormData(prev => ({ ...prev, test_cases: updatedCases }));
  };

  // MODIFIED: Simplified add test case handler
  const addTestCase = () => {
    setFormData(prev => ({
      ...prev,
      test_cases: [...prev.test_cases, { input: '', expected_output: '' }]
    }));
  };

  // MODIFIED: Simplified remove test case handler
  const removeTestCase = (index) => {
    if (formData.test_cases.length <= 1) {
      onToast("You must have at least one test case.", "error");
      return;
    }
    setFormData(prev => ({
      ...prev,
      test_cases: prev.test_cases.filter((_, i) => i !== index)
    }));
  };
  
  const handleTagInputChange = (e) => setFormData(prev => ({...prev, tagInput: e.target.value}));
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = formData.tagInput.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({...prev, tags: [...prev.tags, newTag], tagInput: ''}));
      }
    }
  };
  const removeTag = (tagToRemove) => setFormData(prev => ({...prev, tags: prev.tags.filter(tag => tag !== tagToRemove)}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        onToast("You must be logged in to submit a problem.", "error");
        setIsLoading(false);
        navigate('/auth');
        return;
      }
      
      const { tagInput, ...payload } = formData;
      
      await axios.post(
        'http://localhost:8000/api/problems/submit-problem',
        payload,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      onToast('Problem submitted successfully for review!', 'success');
      navigate('/profile');
    } catch (error) {
      console.error('Problem submission error:', error);
      onToast(error.response?.data?.detail || 'Failed to submit problem.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // MODIFIED: Simplified JSX for rendering test cases
  const TestCaseInputs = () => (
    <div>
      <h3 className={classNames.h3}>Test Cases</h3>
      {formData.test_cases.map((testCase, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-800 pb-4 mb-4">
          <div>
            <Label htmlFor={`input-${index}`} className={classNames.label}>Input (stdin)</Label>
            <Textarea 
              id={`input-${index}`} 
              name="input" 
              value={testCase.input} 
              onChange={(e) => handleTestCaseChange(index, e)} 
              className={classNames.textarea}
              placeholder="Enter each input on a new line, just as it would be read from the console."
              required 
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor={`expected-${index}`} className={classNames.label}>Expected Output (stdout)</Label>
            <Textarea 
              id={`expected-${index}`} 
              name="expected_output" 
              value={testCase.expected_output} 
              onChange={(e) => handleTestCaseChange(index, e)} 
              className={classNames.textarea} 
              placeholder="Enter the exact expected output, including newlines."
              required 
            />
            <button type="button" onClick={() => removeTestCase(index)} className="mt-2 ml-auto text-red-500 hover:text-red-400">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addTestCase} className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white mt-2">
        <PlusCircle size={16} className="mr-2" /> Add Test Case
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-gray-700 pixel-border">
        <h2 className="text-3xl font-pixel text-center mb-8 text-shadow-neon text-white">Submit Your Problem</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" className={classNames.label}>Problem Title</Label>
              <Input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={classNames.input} required />
            </div>
            <div>
              <Label htmlFor="difficulty" className={classNames.label}>Difficulty</Label>
              <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} className={classNames.select}>
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="description" className={classNames.label}>Description (Supports Markdown)</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className={classNames.textarea + " h-32"} placeholder="Clearly explain the problem, input format, and output format." required />
          </div>
          <div>
            <Label htmlFor="constraints" className={classNames.label}>Constraints (Supports Markdown)</Label>
            <Textarea id="constraints" name="constraints" value={formData.constraints} onChange={handleChange} className={classNames.textarea} placeholder="e.g., 1 <= n <= 10^5" />
          </div>
          <div>
            <Label htmlFor="tagInput" className={classNames.label}>Tags (Type and press Enter)</Label>
            <div className={`flex flex-wrap items-center gap-2 ${classNames.input} min-h-[40px] p-2`}>
              {formData.tags.map((tag) => (
                <span key={tag} className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-tech flex items-center">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-white hover:text-gray-200 focus:outline-none">&times;</button>
                </span>
              ))}
              <Input type="text" id="tagInput" name="tagInput" value={formData.tagInput} onChange={handleTagInputChange} onKeyDown={handleTagKeyDown} className="!h-auto !w-auto flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:outline-none" placeholder={formData.tags.length === 0 ? "Add tags..." : ""} />
            </div>
          </div>
          
          <div className="space-y-8 pt-4 border-t border-gray-800">
            <TestCaseInputs />
          </div>

          <Button type="submit" disabled={isLoading} className={classNames.button + " w-full"}>
            {isLoading ? 'Submitting...' : 'Submit Problem for Review'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProblemSubmissionForm;
