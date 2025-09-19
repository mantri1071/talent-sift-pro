import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Footer from "@/components/Footer";
import JobFormStep1 from "@/components/JobFormStep1";
import ResumeList from "@/components/existing";
import logo from "./logo.png";
import axios from "axios";

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

  const [orgId, setOrgId] = useState(null); // ✅ Track case/org ID
  const [submittedExisting, setSubmittedExisting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Auto-populate jobDescription and requiredSkills from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
  
    const decodeSafe = (str) => {
      try {
        return decodeURIComponent(str);
      } catch {
        return '';
      }
    };
  
    const jobTypeLabel = decodeSafe(params.get('jobtype') || '').trim();
  
    // Map labels from URL param to select values exactly
    const jobTypeMap = {
      'Full time': 'fulltime',
      'Part time': 'parttime',
      'Contract': 'contract',
      'Freelance': 'freelance',
      'Internship': 'internship',
    };
  
    const mappedJobType = jobTypeMap[jobTypeLabel] || '';
  
    setFormData(prev => ({
      ...prev,
      requiredSkills: decodeSafe(params.get('skills') || ''),
      jobDescription: decodeSafe(params.get('job') || ''),
      yearsOfExperience: decodeSafe(params.get('yoe') || ''),
      jobTitle: decodeSafe(params.get('jobtitle') || ''),
      jobType: mappedJobType,  // THIS MUST BE a valid option value or empty string
    }));
  }, []);
  
  // Helper to strip HTML tags from job description
  const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    // Add space after block elements to keep words separate
    const blockTags = ['p', 'div', 'br', 'li'];
    blockTags.forEach(tag => {
      const elements = div.getElementsByTagName(tag);
      for (let el of elements) {
        el.appendChild(document.createTextNode(' '));
      }
    });
    return div.textContent || div.innerText || '';
  };
  // ✅ Restore orgId on load if available
  useEffect(() => {
    const storedId = localStorage.getItem("caseId");
    if (storedId) setOrgId(storedId);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ New Submission
 const handleSubmit = async () => {
    if (!formData.jobTitle || !formData.jobType || !formData.jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.resumeFiles) {
      toast({
        title: "Missing Resume",
        description: "Please upload a resume before submitting.",
        variant: "destructive"
      });
      return;
    }

    try {
      const form = new FormData();
      const orgIdFromStorage = Number(localStorage.getItem("orgId") || 1);

      const jobPayload = {
        org_id: orgIdFromStorage,
        exe_name: formData.requiredSkills,
        workflow_id: "resume_ranker",
        job_description: stripHtml(formData.jobDescription) || "No description",
      };

      form.append("data", JSON.stringify(jobPayload));

      if (formData.resumeFiles instanceof File) {
        form.append("resumes", formData.resumeFiles);
      } else if (Array.isArray(formData.resumeFiles)) {
        formData.resumeFiles.forEach(file => {
          if (file instanceof File) form.append("resumes", file);
        });
      }

      const params = new URLSearchParams(window.location.search);
      const source = params.get("source") || "";

      // ✅ Always call Agentic AI first
      const response = await fetch(
        "https://agentic-ai.co.in/api/agentic-ai/workflow-exe",
        { method: "POST", body: form }
      );

      const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "Upload failed with status " + response.status);
}

      console.log("✅ Agentic AI response:", result.data);

      const resumeResults = result.data?.result;
      if (!Array.isArray(resumeResults) || resumeResults.length === 0) {
        throw new Error("Agentic AI returned no valid results.");
      }

      // Branch by source
      if (source === "servicenow") {
        console.log("source:", source);
        console.log("Saving results to ServiceNow table...");

        const servicenowResponse = await axios.post(
          'https://dev187243.service-now.com/api/1763965/resumerankingapi/upload',
          resumeResults,
          {
            auth: {
              username: 'admin',
              password: 'aTw3Prz$PR/7', // ⚠️ avoid hardcoding in production
            },
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );

        console.log("✅ ServiceNow Response:", servicenowResponse.data);

        toast({
          title: "Success!",
          description: "✅ Resume submitted successfully to Agentic AI & ServiceNow.",
        });
      }

      else if (source === "qntrl") {
        console.log("source:", source);
        console.log("Passing Agentic AI results to Qntrl...");

        // Send each result individually to Qntrl custom function
        for (const item of resumeResults) {
          const payload = {
            name: item.name || "",
            score: item.score || "",
            phone: item.phone || "",
            email: item.email || "",
            justification: item.justification || ""
          };

          try {
            const qntrlResponse = await fetch(
              "https://core.qntrl.com/blueprint/api/startitnow/customfunction/executefunction/30725000001381119?auth_type=oauth",
              {
                method: "POST",
                headers: {
                  "Authorization": "Zoho-oauthtoken 1001.5463f5c0493a16f6bb82c3e842f58b22.1c6aa695092e2f82178622fc6e9e9e06", // replace with a real token
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              }
            );

            const qntrlResult = await qntrlResponse.json();

            if (!qntrlResponse.ok) {
              throw new Error(qntrlResult.message || "Qntrl submission failed");
            }

            console.log("✅ Sent to Qntrl:", qntrlResult);
          } catch (err) {
            console.error("❌ Qntrl submission failed:", err.message || err);
          }
        }

        toast({
          title: "Success!",
          description: "✅ Agentic AI results successfully submitted to Qntrl.",
        });
      }

    } catch (error) {
      console.error("❌ Upload failed:", error.response?.data || error.message || error);
      toast({
        title: "Upload Failed",
        description: "❌ Something went wrong. Check console for details.",
        variant: "destructive"
      });
    }
  };

    // ✅ Existing Flow
  const handleExistingSubmit = () => {
    setSubmittedExisting(true);
  };

  
  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
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
      <div className="relative z-10 min-h-screen flex flex-col ">
        {/* Logo/Header */}
        <div className="p-8 flex items-center justify-start space-x-4">
          <img src={logo} alt="Talent Sift Logo" className="h-10" />
          <div className="absolute top-0 right-0 p-4 flex items-center justify-end space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-blue font-bold">T</span>
            </div>
            <span className="text-2xl font-serif font-bold text-gray-800">Talent Sift</span>
          </div>
          <div className="absolute top-6 right-0 p-4 flex items-center justify-end space-x-2">
            <span className="text-s font-serif text-gray-500">Beta Version</span>
          </div>
        </div>

        {/* Main Section */}
        <div className="flex-1 flex items-center justify-center p-4">
          {!submittedExisting ? (
            <JobFormStep1
              formData={formData}
              handleInputChange={handleInputChange}
              onNewSubmit={handleSubmit}
              onExistingSubmit={handleExistingSubmit}
            />
          ) : (
            <ResumeList />
          )}
        </div>

        {/* Global Toaster */}
        <Toaster />
      </div>

      {/* Footer */}
          <div className="mt-8 ml-1 w-full">
            <Footer />
          </div>
    </div>
  );
}

export default App;
