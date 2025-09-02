import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import JobFormStep1 from "@/components/JobFormStep1";
import ResumeList from "@/components/existing"; // Your ResumeList component
import logo from "./logo.png";

function App() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    yearsOfExperience: "",
    jobType: "",
    location: "",
    requiredSkills: "",
    jobDescription: "",
    resumeFiles: [],
  });

  const [submittedExisting, setSubmittedExisting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Main submit handler without org creation API call
const handleNewSubmit = async (data) => {
  if (!data.jobTitle || !data.jobType || !data.jobDescription) {
    toast({
      title: "Missing Information",
      description: "Please fill in all required fields before submitting.",
      variant: "destructive",
    });
    return;
  }

  if (!data.resumeFiles?.length) {
    toast({
      title: "Missing Resume",
      description: "Please upload at least one resume before submitting.",
      variant: "destructive",
    });
    return;
  }

  try {
    // ✅ Check if org_id already exists
    const existingOrgId = localStorage.getItem("orgId");

    const form = new FormData();

    const stripHtml = (html) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || "";
    };

    const jobPayload = {
      exe_name: data.requiredSkills,
      workflow_id: "resume_ranker",
      job_description: stripHtml(data.jobDescription) || "No description",
    };

    // ✅ Include org_id only if it already exists
    if (existingOrgId) {
      jobPayload.org_id = Number(existingOrgId);
    }

    form.append("data", JSON.stringify(jobPayload));

    data.resumeFiles.forEach((file) => {
      if (file instanceof File) {
        form.append("resumes", file);
      }
    });

    const response = await fetch("https://agentic-ai.co.in/api/agentic-ai/workflow-exe", {
      method: "POST",
      body: form,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Upload failed with status ${response.status}`);
    }

    console.log("✅ Response:", result.data);

    // ✅ Save the new org_id if returned
    if (result.data?.id) {
      localStorage.setItem("orgId", result.data.id);
    }

    localStorage.setItem("resumeResults", JSON.stringify(result.data?.result || []));

    toast({
      title: "Success!",
      description: "✅ Resumes processed successfully.",
    });

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

  // Existing Flow → show ResumeList
  const handleExistingSubmit = () => {
    setSubmittedExisting(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-350 via-blue-500 to-blue-600 relative overflow-hidden">
      <Helmet>
        <title>Talent Sift - Resume Screening Platform</title>
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
        <div className="p-8 flex items-center justify-start space-x-4">
          <img src={logo} alt="Talent Sift Logo" className="h-10" />
          <div className=" absolute top-0 right-0 p-4 flex items-center justify-end space-x-2 ">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-blue font-bold">T</span>
            </div>
            <span className="text-2xl font-serif font-bold text-gray-100">Talent Sift</span>
          </div>

          <div className=" absolute top-6 right-0 p-4 flex items-center justify-end space-x-2 ">
            <span className="text-m font-serif text-gray-100">Beta Version</span>
          </div>
        </div>

        {/* Main Section */}
        <div className="flex-1 flex items-center justify-center p-4">
          {!submittedExisting ? (
            <JobFormStep1
              formData={formData}
              handleInputChange={handleInputChange}
              onNewSubmit={handleNewSubmit}
              onExistingSubmit={handleExistingSubmit}
            />
          ) : (
            <ResumeList />
          )}
        </div>

        {/* Global Toaster */}
        <Toaster />
      </div>
    </div>
  );
}

export default App;
