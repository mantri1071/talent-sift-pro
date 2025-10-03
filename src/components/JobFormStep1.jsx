import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Clock, Star, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResumeMultiDropzoneStyled from '@/components/ResumeMultiDropzoneStyled';
import pic from '../pic.png';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FloatingIcon = ({ children, className }) => (
  <motion.div
    className={`absolute bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-lg ${className}`}
    initial={{ y: 0, opacity: 0, scale: 0.5 }}
    animate={{ y: [0, -10, 0], opacity: 1, scale: 1 }}
    transition={{ duration: 3, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

function JobDescriptionEditor({ value, onChange, minWords = 100, maxWords = 200, onValidChange, readOnly }) {
  const [error, setError] = useState('');

  const countWords = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  useEffect(() => {
    const wordCount = countWords(value);
    if (wordCount < minWords) {
      setError(`Minimum ${minWords} words (currently ${wordCount})`);
      onValidChange && onValidChange(false);
    } else if (wordCount > maxWords) {
      setError(`Maximum ${maxWords} words (currently ${wordCount})`);
      onValidChange && onValidChange(false);
    } else {
      setError('');
      onValidChange && onValidChange(true);
    }
  }, [value, minWords, maxWords, onValidChange]);

  return (
    <div className="relative">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ header: [1, 2, 3, false] }],
            ['clean'],
          ],
        }}
        formats={['bold', 'italic', 'underline', 'header']}
        placeholder="Describe the role, responsibilities, requirements..."
        className="bg-white/70 border border-gray-300 rounded-md min-h-[200px]"
        readOnly={readOnly}
      />
      {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
    </div>
  );
}

const JobFormStep1 = ({ formData, handleInputChange, onNewSubmit, onExistingSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescriptionIsValid, setJobDescriptionIsValid] = useState(false);
  const [mode, setMode] = useState('new');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (mode === 'new') {
      if (!formData.jobTitle) newErrors.jobTitle = 'Job Title is required';
      if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Experience is required';
      if (!formData.jobType) newErrors.jobType = 'Job Type is required';
      if (!formData.requiredSkills) newErrors.requiredSkills = 'Please enter one or more skills';
     if (!formData.email) newErrors.email = 'Please enter email';
      if (!jobDescriptionIsValid) newErrors.jobDescription = 'Job description must be valid';
      if (!formData.resumeFiles || formData.resumeFiles.length === 0) newErrors.resumeFiles = 'At least one resume must be uploaded';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await onNewSubmit(formData);
      const skillsArray = formData.requiredSkills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);
      localStorage.setItem('keySkills', JSON.stringify(skillsArray));
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const runExisting = async () => {
      if (mode === 'existing') {
        setIsLoading(true);
        try {
          await onExistingSubmit();
        } catch (error) {
          console.error('Existing submit error:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    runExisting();
  }, [mode, onExistingSubmit]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md">
            <div className="text-lg font-semibold text-blue-600 animate-pulse">Processing...</div>
          </div>
        )}
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-24">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex items-center justify-center mb-8 lg:mb-0"
          >
            <div className="relative w-full max-w-6xl mx-auto">
              <div className="mb-6 text-center max-w-3xl mx-auto px-4">
                <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-orange-400">
                  Resume Ranking <br />
                  <span className="text-gray-800 whitespace-nowrap">for Perfect Matches</span>
                </h1>
                <p className="mt-4 text-lg text-gray-800">
                  Our AI-powered tool compares resumes to job descriptions, helping you find the most qualified candidates.
                </p>
              </div>
              <div>
                <FloatingIcon className="top-10 -left-8 text-blue-500">
                  <Briefcase size={24} />
                </FloatingIcon>
                <FloatingIcon className="bottom-16 -right-8 text-green-500">
                  <Star size={24} />
                </FloatingIcon>
                <motion.img
                  src={pic}
                  alt="Collaboration"
                  className="w-full h-auto rounded-3xl shadow-2xl object-cover"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div layout className="flex-1 w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-100 backdrop-blur-lg rounded-3xl shadow-2xl p-8"
            >
              {/* Mode Switch */}
              <div className="mb-6 flex items-center space-x-6">
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name="mode"
                    value="new"
                    checked={mode === 'new'}
                    onChange={() => setMode('new')}
                    disabled={isLoading}
                  />
                  <span>New Case</span>
                </label>
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name="mode"
                    value="existing"
                    checked={mode === 'existing'}
                    onChange={() => setMode('existing')}
                    disabled={isLoading}
                  />
                  <span>Candidate Database</span>
                </label>
              </div>

              {/* New Case Form */}
              {mode === 'new' && (
              <form
                onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
         }}
  >
                  {/* Job Title & Experience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 font-semibold text-slate-800">                   
                      <Briefcase className="w-4 h-4" />
                      Job Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. Senior Frontend Developer"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className="bg-white/70"
                      disabled={isLoading}
                    />
                    {errors.jobTitle && <p className="text-red-600 text-sm">{errors.jobTitle}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-slate-800 font-semibold ">
                      <Clock className="w-4 h-4" />
                      Years of Experience <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 3"
                      value={formData.yearsOfExperience}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          handleInputChange('yearsOfExperience', value);
                        }
                      }}
                      onWheel={(e) => e.target.blur()}
                      className="bg-white/70"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Job Type & Key Skills */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 mb-4">
  <div className="space-y-2">
    <Label className="flex items-center gap-2 text-slate-800 font-semibold">
      <Users className="w-4 h-4" />
      Job Type <span className="text-red-500">*</span>
    </Label>
    <Input
      placeholder=" e.g. Full-time, Part-time, Contract"
      value={formData.jobType}
      onChange={(e) => handleInputChange('jobType', e.target.value)}
      className="bg-white/70"
      disabled={isLoading}
    />
  </div>

  <div className="space-y-2">
    <Label className="flex items-center gap-2 text-slate-800 font-semibold">
      <GraduationCap className="w-4 h-4" />
      Key Skills <span className="text-red-500">*</span>
    </Label>
    <Input
      placeholder=" separate skill with comma"
      value={formData.requiredSkills}
      onChange={(e) => handleInputChange('requiredSkills', e.target.value)}
      className="bg-white/70"
      disabled={isLoading}
    />
  </div>
  </div>

  
                <div className="space-y-2 mb-4">
                <Label className="flex items-center gap-2 text-slate-800 font-semibold ">
                  Industry <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. Information Technology, Healthcare"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="bg-white/70 border-gray-300"
                  disabled={isLoading}
                />
                {errors.industry && <p className="text-red-600 text-sm">{errors.industry}</p>}
              </div>

  <div className="space-y-2 mb-4">
    <Label className="flex items-center gap-2 text-slate-800 font-semibold">
      <GraduationCap className="w-4 h-4" />
      Email <span className="text-red-500">*</span>
    </Label>
    <Input
      placeholder="enter valid mail id"
      value={formData.email}
      onChange={(e) => handleInputChange('email', e.target.value)}
      className="bg-white/70"
      disabled={isLoading}
    />
  </div>

                {/* Resume Upload */}
                <ResumeMultiDropzoneStyled
                  onFilesSelected={(files) => handleInputChange('resumeFiles', files)}
                  defaultFiles={formData.resumeFiles}
                  disabled={isLoading}
                />
                {errors.resumeFiles && <p className="text-red-600 text-sm">{errors.resumeFiles}</p>}

                {/* Job Description */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-800 font-semibold mt-4 mb-2">
                    <FileText className="w-4 h-4" />
                    Job Description <span className="text-red-500">*</span>
                  </Label>
                  <JobDescriptionEditor
                    value={formData.jobDescription}
                    onChange={(value) => handleInputChange('jobDescription', value)}
                    minWords={100}
                    maxWords={200}
                    onValidChange={setJobDescriptionIsValid}
                    readOnly={isLoading}
                  />
                  {errors.jobDescription && <p className="text-red-600 text-sm">{errors.jobDescription}</p>}
                </div>

                {/* Submit Button */}
              <Button
               type="submit"
               disabled={isLoading || !jobDescriptionIsValid}
               className="bg-blue-600 hover:bg-blue-700 text-white px-8 mt-4"
      >
              {isLoading ? 'Processing...' : 'Submit'}
              </Button>
            </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </main>
  </div>
);
};

export default JobFormStep1;

