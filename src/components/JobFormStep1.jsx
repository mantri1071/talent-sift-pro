import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, Star, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResumeDropzoneStyled from '@/components/ResumeDropzoneStyled';
import pic from '../pic.png';

const FloatingIcon = ({ children, className }) => (
  <motion.div
    className={`absolute bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-lg ${className}`}
    initial={{ y: 0, opacity: 0, scale: 0.5 }}
    animate={{ y: [0, -10, 0], opacity: 1, scale: 1 }}
    transition={{ duration: 3, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const JobFormStep1 = ({ formData, handleInputChange, handleNext, handleSaveDraft }) => {
  return (
    <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center mb-8 lg:mb-0"
      >
        <div className="relative w-full max-w-md">
           <FloatingIcon className="top-10 -left-8 text-blue-500">
            <Briefcase size={24} />
          </FloatingIcon>
           <FloatingIcon className="bottom-16 -right-8 text-green-500">
            <Star size={24} />
          </FloatingIcon>

          <motion.img
            src={pic}
            alt="Two colleagues collaborating on a project"
            className="w-full h-auto rounded-3xl shadow-2xl cursor-pointer"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05, y: -10, transition: { duration: 0.4 } }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      <motion.div
        layout
        className="flex-1 w-full max-w-2xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-sky-50/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8"
        >
          <div className="flex items-center justify-start mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">T</span>
              </div>
              <span className="text-xl font-bold text-gray-800">TALENT SIFT</span>
            </div>
          </div>

          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-800 font-semibold">
                  <Briefcase className="w-4 h-4" />
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className="bg-white/70 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-800 font-semibold">
                  <Clock className="w-4 h-4" />
                  Years of Experience
                </Label>
                 <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 3"
                  value={formData.yearsOfExperience}
                  onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                  const numericValue = Number(value);
                  if (value === '' || (numericValue >= 0 && numericValue <= 30)) {
                  handleInputChange('yearsOfExperience', value);
                }
              }
            }}
               onWheel={(e) => e.target.blur()}
              className="bg-white/70 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />

            </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-800 font-semibold">
                  <Users className="w-4 h-4" />
                  Job Type <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                  <SelectTrigger className="bg-white/70 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-800 font-semibold">
                  <MapPin className="w-4 h-4" />
                  Location(s)
                </Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger className="bg-white/70 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="select locations..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ResumeDropzoneStyled
            onFileSelected={(file) => handleInputChange('resumeFile', file)}
            defaultFile={formData.resumeFile}
            />

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-800 font-semibold">
                <FileText className="w-4 h-4" />
                Job Description <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <strong>B</strong>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <em>I</em>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <u>U</u>
                </Button>
                <Select defaultValue="normal">
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="heading">Heading</SelectItem>
                    <SelectItem value="subheading">Subheading</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Describe the role, responsibilities, requirements, etc..."
                value={formData.jobDescription}
                onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                className="min-h-[120px] bg-white/70 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="bg-white/80 hover:bg-white border-gray-300 text-gray-800"
              >
                Save Draft
              </Button>
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Save & Continue
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JobFormStep1;