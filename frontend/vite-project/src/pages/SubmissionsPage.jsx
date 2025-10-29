// src/pages/SubmissionsPage.jsx
"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, ServerCrash, Inbox, Clock, Code, Hash, CheckCircle, FileText } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button"; // --- NEW ---
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // --- NEW ---

const SubmissionsPage = ({ onToast }) => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_API_URL;

  // --- NEW: State for analysis modal ---
  const [analysisState, setAnalysisState] = useState({
    isLoading: false,
    subId: null,
    type: null, // 'time' or 'space'
  });
  const [analysisResult, setAnalysisResult] = useState(null); // { title: '', content: '' }
  const [isModalOpen, setIsModalOpen] = useState(false);
  // --- END NEW ---

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

  // --- NEW: Handler for calling the analysis endpoint ---
  const handleAnalyze = async (submissionId, type) => {
    setAnalysisState({ isLoading: true, subId: submissionId, type: type });
    setAnalysisResult(null);
    setIsModalOpen(true); // Open the modal to show loading

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${backendUrl}/api/submissions/${submissionId}/analyze`,
        { analysis_type: type }, // The payload
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setAnalysisResult({
        title: type === 'time' ? 'Time Complexity Analysis' : 'Space Complexity Analysis',
        content: response.data.analysis
      });
      
    } catch (err) {
      console.error("Failed to get analysis:", err);
      const errorMsg = err.response?.data?.detail || "Analysis service failed.";
      setAnalysisResult({
        title: 'Error',
        content: errorMsg
      });
    } finally {
      setAnalysisState({ isLoading: false, subId: null, type: null });
    }
  };
  // --- END NEW ---

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
                    
                    {/* --- MODIFIED: Added buttons inside AccordionContent --- */}
                    <AccordionContent className="bg-gray-900 rounded-b-lg p-4">
                        <pre className="bg-black rounded-md p-4 overflow-x-auto">
                            <code className={`language-${sub.language} text-sm`}>
                                {sub.code}
                            </code>
                        </pre>
                        {/* --- NEW: Analysis Buttons --- */}
                        <div className="mt-4 flex space-x-4">
                          <Button 
                            size="sm"
                            variant="outline"
                            className="text-cyan-400 border-cyan-400 hover:bg-cyan-900 hover:text-cyan-300 font-tech"
                            onClick={() => handleAnalyze(sub.id, "time")}
                            disabled={analysisState.isLoading}
                          >
                            {analysisState.isLoading && analysisState.subId === sub.id && analysisState.type === 'time' 
                              ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                              : <FileText className="w-4 h-4 mr-2" />
                            }
                            Analyze Time
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            className="text-orange-400 border-orange-400 hover:bg-orange-900 hover:text-orange-300 font-tech"
                            onClick={() => handleAnalyze(sub.id, "space")}
                            disabled={analysisState.isLoading}
                          >
                            {analysisState.isLoading && analysisState.subId === sub.id && analysisState.type === 'space' 
                              ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                              : <Hash className="w-4 h-4 mr-2" />
                            }
                            Analyze Space
                          </Button>
                        </div>
                        {/* --- END NEW --- */}
                    </AccordionContent>
                    {/* --- END MODIFICATION --- */}

                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>

      {/* --- NEW: Analysis Modal --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white font-tech max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-pixel text-2xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {analysisState.isLoading ? "Analyzing..." : (analysisResult?.title || "Analysis")}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {analysisState.isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                <p className="ml-3">Generating analysis with AI...</p>
              </div>
            ) : (
              <div className="text-gray-300 whitespace-pre-wrap text-base leading-relaxed">
                {analysisResult?.content}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* --- END NEW --- */}

    </div>
  );
};

export default SubmissionsPage;