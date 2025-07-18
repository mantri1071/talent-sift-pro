import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const JobFormStep2 = ({ formData, handleInputChange, handleBack, handleSaveAndContinue }) => {
  return (
    <motion.div
      layout
      className="w-full max-w-2xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-sky-50/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 bg-white/80 hover:bg-white text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">T</span>
            </div>
            <span className="text-lg font-bold text-gray-800">TALENT SIFT</span>
          </div>
        </div>

        <motion.div
          key="step2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Salary Range (₹)</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-800 font-semibold">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger className="bg-white/70 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR (₹)">INR (₹)</SelectItem>
                  <SelectItem value="USD ($)">USD ($)</SelectItem>
                  <SelectItem value="EUR (€)">EUR (€)</SelectItem>
                  <SelectItem value="GBP (£)">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-800 font-semibold">Minimum</Label>
              <Input
                type="number"
                placeholder="Eg: 5,00,000"
                value={formData.minSalary}
                onChange={(e) => handleInputChange('minSalary', e.target.value)}
                className="bg-white/70 border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-800 font-semibold">Maximum</Label>
              <Input
                type="number"
                placeholder="Eg: 6,00,000"
                value={formData.maxSalary}
                onChange={(e) => handleInputChange('maxSalary', e.target.value)}
                className="bg-white/70 border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-800 font-semibold">Unit</Label>
              <Select value={formData.salaryUnit} onValueChange={(value) => handleInputChange('salaryUnit', value)}>
                <SelectTrigger className="bg-white/70 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Per Year">Per Year</SelectItem>
                  <SelectItem value="Per Month">Per Month</SelectItem>
                  <SelectItem value="Per Hour">Per Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hideSalary"
              checked={formData.hideSalary}
              onCheckedChange={(checked) => handleInputChange('hideSalary', checked)}
            />
            <Label htmlFor="hideSalary" className="text-slate-800">
              Hide salary from candidate
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-800 font-semibold">Function</Label>
              <Select value={formData.function} onValueChange={(value) => handleInputChange('function', value)}>
                <SelectTrigger className="bg-white/70 border-gray-300">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-800 font-semibold">Employer Job ID</Label>
              <Input
                placeholder="Enter unique job identifier"
                value={formData.employerJobId}
                onChange={(e) => handleInputChange('employerJobId', e.target.value)}
                className="bg-white/70 border-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-800 font-semibold">Vacancies</Label>
            <Input
              type="number"
              value={formData.vacancies}
              onChange={(e) => handleInputChange('vacancies', e.target.value)}
              className="bg-white/70 border-gray-300 max-w-xs"
            />
          </div>

          <div className="flex justify-center pt-8">
            <Button
              onClick={handleSaveAndContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2.5"
            >
              Save & Continue
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default JobFormStep2;