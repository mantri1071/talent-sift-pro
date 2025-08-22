import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Range } from 'react-range';

const getRankLabel = (score) => {
  if (score >= 9) return '≥ 9';
  if (score >= 8) return '≥ 8';
  if (score >= 7) return '≥ 7';
  return '≥ 6';
};

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreRange, setScoreRange] = useState([1, 10]);
  const [experienceRange, setExperienceRange] = useState([0, 10]);
  const [filterEmail, setFilterEmail] = useState(false);
  const [filterPhone, setFilterPhone] = useState(false);
  const [filteredResumes, setFilteredResumes] = useState([]);

useEffect(() => {
  const stored = localStorage.getItem('resumeResults');
  if (!stored) return;

  try {
    const data = JSON.parse(stored);
    const mapped = data.map((item, index) => ({
      id: index + 1,
      name: item.name || `Candidate ${index + 1}`,
      Rank: item.score,
      justification: item.justification || '',
      experience: item.experience || 3,
      email: item.email || null,
      phone: item.phone || null,
      keySkills: item.keySkills || [],
    }));
    setResumes(mapped);
  } catch (err) {
    console.error('Error parsing stored resumes:', err);
  }
}, []);

  useEffect(() => {
    const filtered = resumes.filter((resume) => {
      const matchesSearch =
        resume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resume.email && resume.email.toLowerCase().includes(searchQuery.toLowerCase()));

      const inScoreRange = resume.Rank >= scoreRange[0] && resume.Rank <= scoreRange[1];
      const inExperienceRange =
        resume.experience >= experienceRange[0] && resume.experience <= experienceRange[1];

      const hasEmail = filterEmail ? Boolean(resume.email) : true;
      const hasPhone = filterPhone ? Boolean(resume.phone) : true;

      return matchesSearch && inScoreRange && inExperienceRange && hasEmail && hasPhone;
    });

    setFilteredResumes(filtered);
  }, [searchQuery, scoreRange, experienceRange, filterEmail, filterPhone, resumes]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-400 to-blue-500 p-4 sm:p-6 flex justify-center items-start">
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-xl w-full max-w-6xl p-4 sm:p-6 flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-blue-100 rounded-xl p-4 sm:p-6 shadow-md flex flex-col flex-shrink-0">
          <h3 className="font-bold text-blue-900 mb-5 text-xl">🔍 Filter Options</h3>

          {/* Search */}
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-6 px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 font-medium placeholder-gray-400"
          />

          {/* Score Range */}
          <label className="font-semibold text-blue-800 mb-3 block text-lg">Score Range</label>
          <div className="flex justify-between mb-3 text-blue-900 font-semibold text-sm">
            <span>{scoreRange[0]}</span>
            <span>{scoreRange[1]}</span>
          </div>

          <Range
            step={1}
            min={1}
            max={10}
            values={scoreRange}
            onChange={(values) => setScoreRange(values)}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '6px',
                  width: '100%',
                  backgroundColor: '#ddd',
                  borderRadius: '3px',
                }}
              >
                <div
                  style={{
                    height: '6px',
                    width: `${((scoreRange[1] - scoreRange[0]) / 9) * 100}%`,
                    backgroundColor: '#2563eb',
                    borderRadius: '3px',
                    marginLeft: `${((scoreRange[0] - 1) / 9) * 100}%`,
                  }}
                />
                {children}
              </div>
            )}
            renderThumb={({ index, props }) => (
              <div
                {...props}
                className="h-5 w-5 rounded-full bg-blue-600 shadow-md cursor-pointer"
                style={{ ...props.style }}
              >
                <div className="text-white text-xs select-none mt-6 text-center w-10 -ml-2">
                  {scoreRange[index]}
                </div>
              </div>
            )}
          />

          {/* Experience Range */}
          <label className="font-semibold text-blue-800 mt-6 mb-3 block text-lg">Experience (years)</label>
          <label className="text-blue-900 font-semibold mb-2 block">
            Select Experience Range</label>
          <div className="flex justify-between mb-3 text-blue-900 font-semibold text-sm">
            <span>{experienceRange[0]}</span>
            <span>{experienceRange[1]}</span>
          </div>

          <Range
            step={1}
            min={0}
            max={10}
            values={experienceRange}
            onChange={(values) => setExperienceRange(values)}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '6px',
                  width: '100%',
                  backgroundColor: '#ddd',
                  borderRadius: '3px',
                }}
              >
                <div
                  style={{
                    height: '6px',
                    width: `${((experienceRange[1] - experienceRange[0]) / 10) * 100}%`,
                    backgroundColor: '#2563eb',
                    borderRadius: '3px',
                    marginLeft: `${(experienceRange[0] / 10) * 100}%`,
                  }}
                />
                {children}
              </div>
            )}
            renderThumb={({ index, props }) => (
              <div
                {...props}
                className="h-5 w-5 rounded-full bg-blue-600 shadow-md cursor-pointer"
                style={{ ...props.style }}
              >
                <div className="text-white text-xs select-none mt-6 text-center w-10 -ml-2">
                  {experienceRange[index]}
                </div>
              </div>
            )}
          />

          {/* Email & Phone Filters */}
          <div className="mt-6 space-y-3">
            <label className="inline-flex items-center gap-2 text-blue-900 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={filterEmail}
                onChange={() => setFilterEmail(!filterEmail)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Email
            </label>

            <label className="inline-flex items-center gap-2 text-blue-900 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={filterPhone}
                onChange={() => setFilterPhone(!filterPhone)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-10"
              />
              Phone
            </label>
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-slate-800 font-semibold">
          Key Skills 
        </label>
        <Input
          value={keySkills}
          readOnly
          className="w-[230px] bg-gray-100 border-gray-300 cursor-not-allowed"
        />
      </div>
    </div>

        {/* Resume Display */}
        <motion.div layout className="flex-1 space-y-6 overflow-auto max-h-[80vh]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-3xl font-semibold text-blue-900">📄 Talent Sift</h2>
            <h3 className="text-2xl font-semibold text-black-900">Dashboard</h3>
          </div>
          <p className="text-blue-800 font-medium mb-4">
            Showing <span className="font-bold">{filteredResumes.length}</span> of{' '}
            <span className="font-bold">{resumes.length}</span> resumes
          </p>

          <ul className="space-y-4">
            {filteredResumes.length === 0 ? (
              <li className="text-blue-900 italic font-medium">No resumes found.</li>
            ) : (
              filteredResumes.map((resume) => (
                <motion.li
                  layout
                  key={resume.id}
                  className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 border border-blue-200"
                >
                  <div className="text-gray-900 flex flex-col sm:flex-row sm:items-center sm:gap-6 w-full">
                    <div className="font-bold text-xl">{resume.name}</div>
                    <div className="text-blue-700 font-semibold">{resume.email || 'No email'}</div>
                    <div className="text-blue-700 font-semibold">{resume.phone || 'No phone'}</div>
                    <div className="mt-1 text-blue-900 font-semibold sm:mt-0">
                      Score: {resume.Rank} ({getRankLabel(resume.Rank)})
                    </div>
                    <div className="mt-1 text-blue-900 font-semibold sm:mt-0">
                      Experience: {resume.experience} yrs
                    </div>
                  </div>
                  <div className="text-gray-800 mt-2 text-sm whitespace-pre-line">{resume.justification}</div>
                </motion.li>
              ))
            )}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeList;
