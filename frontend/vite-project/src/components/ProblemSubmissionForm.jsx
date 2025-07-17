// src/components/ProblemSubmissionForm.jsx
"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ProblemSubmissionForm = ({ onToast }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy', // Default difficulty
    tags: [], // Tags will be managed as an array of strings
    tagInput: '', // Temporary state for current tag input
    constraints: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const buttonClassName = "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 font-tech font-semibold text-base rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105";
  const inputClassName = "flex h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 font-tech";
  const labelClassName = "text-sm font-semibold text-gray-300 mb-1 font-tech";
  const selectClassName = "flex h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 font-tech";
  const textareaClassName = "flex min-h-[80px] w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 font-tech";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTagInputChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      tagInput: e.target.value,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { // Add tag on Enter or Comma
      e.preventDefault(); // Prevent form submission
      const newTag = formData.tagInput.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData((prevData) => ({
          ...prevData,
          tags: [...prevData.tags, newTag],
          tagInput: '', // Clear input after adding
        }));
      }
    } else if (e.key === 'Backspace' && formData.tagInput === '') { // Remove last tag on Backspace if input is empty
      setFormData((prevData) => ({
        ...prevData,
        tags: prevData.tags.slice(0, prevData.tags.length - 1),
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        onToast("You must be logged in to submit a problem.", "error");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/api/problems/submit-problem', // Corrected API endpoint for v1 prefix
        {
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          tags: formData.tags, // Send as array
          constraints: formData.constraints,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onToast('Problem submitted successfully for review!', 'success');
        setFormData({ // Reset form
          title: '',
          description: '',
          difficulty: 'Easy',
          tags: [],
          tagInput: '',
          constraints: '',
        });
      }
    } catch (error) {
      console.error('Problem submission error:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to submit problem. Please try again.';
      onToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4 relative z-10">
      <div className="w-full max-w-2xl bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-gray-700 pixel-border animate-glow-slow">
        <h2 className="text-3xl font-pixel text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-shadow-neon">
          Submit Your Problem Idea
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className={labelClassName}>Problem Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClassName}
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className={labelClassName}>Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={textareaClassName + " h-32"}
              placeholder="Provide a detailed description of the problem, including example inputs/outputs."
              required
            />
          </div>

          <div>
            <Label htmlFor="constraints" className={labelClassName}>Constraints</Label>
            <Textarea
              id="constraints"
              name="constraints"
              value={formData.constraints}
              onChange={handleChange}
              className={textareaClassName}
              placeholder="e.g., 0 <= n <= 10^5, -10^9 <= arr[i] <= 10^9"
            />
          </div>

          <div>
            <Label htmlFor="difficulty" className={labelClassName}>Difficulty</Label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <Label htmlFor="tagInput" className={labelClassName}>Tags (Type and press Enter or Comma)</Label>
            <div className={`flex flex-wrap items-center gap-2 ${inputClassName} min-h-[40px] p-2`}>
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-tech flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-white hover:text-gray-200 focus:outline-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <Input
                type="text"
                id="tagInput"
                name="tagInput"
                value={formData.tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleKeyDown}
                className="!h-auto !w-auto flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:outline-none" // Override for flex-grow behavior
                placeholder={formData.tags.length === 0 ? "Add tags (e.g., array, dp)" : ""}
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className={buttonClassName + " w-full"}>
            {isLoading ? 'Submitting...' : 'Submit Problem Idea'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProblemSubmissionForm;