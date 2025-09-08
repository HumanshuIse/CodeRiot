// src/pages/SubmissionsPage.jsx
"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, ServerCrash, Inbox, Clock, Code, Hash, CheckCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const SubmissionsPage = ({ onToast }) => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        onToast("You must be logged in to view submissions.", "error");
        navigate('/auth');
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/api/users/me/submissions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSubmissions(response.data);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
        const errorMessage = err.response?.data?.detail || "Could not load your submissions.";
        setError(errorMessage);
        onToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [onToast, navigate, backendUrl]);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-tech">
        <Loader2 className="w-8 h-8 animate-spin mr-3 text-cyan-400" />
        <p>Loading Your Submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-tech text-center px-4">
        <ServerCrash className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-pixel text-red-400 mb-2">An Error Occurred</h2>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 font-tech">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-pixel text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Submission History
        </h1>

        {submissions.length === 0 ? (
          <div className="text-center text-gray-400 mt-16">
            <Inbox className="w-24 h-24 mx-auto mb-4 text-gray-600" />
            <p className="text-xl">You haven't solved any problems yet.</p>
            <p>Your successful submissions will appear here.</p>
          </div>
        ) : (
          <Card className="bg-gray-900/70 border border-gray-700 pixel-border">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {submissions.map((sub, index) => (
                  <AccordionItem value={`item-${index}`} key={sub.id} className="border-b border-gray-800">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex justify-between items-center w-full text-left">
                        <div className="flex items-center space-x-4">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="font-semibold text-lg text-cyan-300">{sub.problem.title}</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-6 text-gray-400 text-sm">
                           <span className="flex items-center"><Code className="w-4 h-4 mr-1.5" />{sub.language}</span>
                           <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" />{formatDateTime(sub.submitted_at)}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-gray-900 rounded-b-lg p-4">
                        <pre className="bg-black rounded-md p-4 overflow-x-auto">
                            <code className={`language-${sub.language} text-sm`}>
                                {sub.code}
                            </code>
                        </pre>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SubmissionsPage;