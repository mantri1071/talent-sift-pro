import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
    resumeFiles: [],
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
  if (!formData.jobTitle || !formData.jobType || !formData.jobDescription) {
    toast({
      title: "Missing Information",
      description: "Please fill in all required fields before submitting.",
      variant: "destructive"
    });
    return;
  }

  if (!formData.resumeFiles?.length) {
    toast({
      title: "Missing Resume",
      description: "Please upload at least one resume before submitting.",
      variant: "destructive"
    });
    return;
  }

  try {
    const form = new FormData();
    const orgId = Number(localStorage.getItem("orgId") || 1);

    const stripHtml = (html) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || "";
    };

    const jobPayload = {
      org_id: orgId,
      exe_name: formData.jobTitle,
      workflow_id: "resume_ranker",
      job_description: stripHtml(formData.jobDescription) || "No description",
    };

    form.append("data", JSON.stringify(jobPayload));

    formData.resumeFiles.forEach(file => {
      if (file instanceof File) form.append("resumes", file);
    });

    const response = await fetch(
      "https://agentic-ai.co.in/api/agentic-ai/workflow-exe",
      { method: "POST", body: form }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Upload failed with status ${response.status}`);
    }

    console.log("✅ Response data:", result.data);

    if (result.data?.id) {
      localStorage.setItem("orgId", result.data.id);
    }
    localStorage.setItem("resumeResults", JSON.stringify(result.data?.result || []));

    toast({ title: "Success!", description: "✅ Resumes processed successfully." });
    navigate("/resumes");
    
  } catch (error) {
    console.error("❌ Upload failed:", error);
    toast({
      title: "Upload Failed",
      description: error.message || "❌ Something went wrong.",
      variant: "destructive",
    });
  }
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
      {/* Background floating blobs */}
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
      {/* App Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Logo/Header */}
        <div className="p-8">
          <img src={logo} alt="Talent Sift Logo" className="h-10" />
        </div>
        {/* Job Form Section */}
        <div className="flex-1 flex items-center justify-center p-4">
          <JobFormStep1
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </div>
        {/* Global Toaster */}
        <Toaster />
      </div>
    </div>
  );
}

export default App;
