import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence, motion } from 'framer-motion';

import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import JobFormStep1 from '@/components/JobFormStep1';
import JobFormStep2 from '@/components/JobFormStep2';
import logo from './logo.png';
function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    jobTitle: '',
    yearsOfExperience: '',
    jobType: '',
    location: '',
    requiredSkills: '',
    jobDescription: '',
    currency: 'INR (₹)',
    minSalary: '',
    maxSalary: '',
    salaryUnit: 'Per Year',
    hideSalary: false,
    function: '',
    employerJobId: '',
    vacancies: '5'
  });

  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.jobTitle || !formData.jobType || !formData.jobDescription) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields before continuing.",
          variant: "destructive"
        });
        return;
      }
    }
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "🚧 This feature isn't implemented yet—"
    });
  };

  const handleSaveAndContinue = () => {
    if (currentStep === 2) {
      // No mandatory fields in step 2 based on user request
    }
    
    toast({
      title: "Job Posted Successfully!",
      description: "🚧 This feature isn't implemented yet—"
    });
  };

  const props = {
    formData,
    handleInputChange,
    handleNext,
    handleBack,
    handleSaveDraft,
    handleSaveAndContinue
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 relative overflow-hidden">
      <Helmet>
        <title>Talent Sift - Job Posting Platform</title>
        <meta name="description" content="Create and post job opportunities with Talent Sift's intuitive job posting platform" />
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
          <AnimatePresence mode="wait">
            {currentStep === 1 ? <JobFormStep1 {...props} /> : <JobFormStep2 {...props} />}
          </AnimatePresence>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default App;