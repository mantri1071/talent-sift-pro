import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence, motion } from 'framer-motion';

import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import JobFormStep1 from '@/components/JobFormStep1';
import logo from './logo.png';

function App() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    yearsOfExperience: '',
    jobType: '',
    location: '',
    requiredSkills: '',
    jobDescription: '',
    resumeFiles: [], // array of uploaded files
  });

  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.jobTitle || !formData.jobType || !formData.jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.resumeFiles || formData.resumeFiles.length === 0) {
      toast({
        title: "Missing Resume",
        description: "Please upload a resume before submitting.",
        variant: "destructive"
      });
      return;
    }

    try {
      const form = new FormData();

      const jobPayload = {
        workflow_id: 'resume_ranker',
        job_description: formData.jobDescription || 'No description'
      };

      form.append('data', JSON.stringify(jobPayload));

      formData.resumeFiles.forEach(file => {
        form.append('resumes', file);
      });

      const response = await fetch('https://3.109.152.70/api/agentic-ai/workflow-exe', {
        method: 'POST',
        body: form,
        // No Content-Type header here; fetch sets it automatically
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const result = await response.json();

      console.log('Response data:', result.data);

      toast({
        title: "Success!",
        description: "✅ Resume submitted successfully.",
      });

    } catch (error) {
      console.error('❌ Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "❌ Something went wrong. Check the console for details.",
        variant: "destructive"
      });
    }
  };

  const props = {
    formData,
    handleInputChange,
    handleSubmit,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-350 via-blue-500 to-blue-600 relative overflow-hidden">
      <Helmet>
        <title>Talent Sift - Job Posting Platform</title>
        <meta
          name="description"
          content="Create and post job opportunities with Talent Sift's intuitive job posting platform"
        />
      </Helmet>

      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-lg animate-pulse delay-1000"></div>
      </motion.div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="p-8">
          <img src={logo} alt="Start IT Now Logo" className="h-10" />
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <JobFormStep1 {...props} />
        </div>

        <Toaster />
      </div>
    </div>
  );
}

export default App;
