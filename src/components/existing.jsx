// ...imports
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Range } from 'react-range';

const extractYearsOfExperience = (text = '') => {
  const match = text.match(/([0-9]*\.?[0-9]+)\s*(\+)?\s*(years|yrs|year|yr)/i);
  return match ? parseFloat(match[1]) : 0;
};

const getRankLabel = (score) => {
};

const ResumeList = () => {
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [searchedResumes, setSearchedResumes] = useState([]);
  const [orgId, setOrgId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [keySkillQuery, setKeySkillQuery] = useState("");
  const [scoreRange, setScoreRange] = useState([1, 10]);
  const [experienceRange, setExperienceRange] = useState([0, 10]);
  const [filterEmail, setFilterEmail] = useState(false);
  const [filterPhone, setFilterPhone] = useState(false);
  const [userKeySkills, setUserKeySkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedSkills = localStorage.getItem("keySkills");
    if (storedSkills) {
      try {
        const skills = JSON.parse(storedSkills);
        setUserKeySkills(Array.isArray(skills) ? skills : []);
      } catch (e) {
        console.error("Error parsing key skills", e);
      }
    }
  }, []);

  const fetchResumesByOrgId = useCallback(async () => {
    if (!orgId.trim()) {
      setError("Please enter Case ID.");
      setSearchedResumes([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const url = `https://agentic-ai.co.in/api/agentic-ai/workflow-exe?org_id=${orgId.trim()}&workflow_id=resume_ranker`;
      const response = await fetch(url);
      const data = await response.json();

      const resumesData =
        Array.isArray(data.data) && data.data.length > 0 && Array.isArray(data.data[0].result)
          ? data.data[0].result
          : [];

      const exeSkill = data.data[0]?.exe_name || "";

      if (!Array.isArray(resumesData) || resumesData.length === 0) {
        setError("No resumes found for this Case ID.");
        setSearchedResumes([]);
        return;
      }

      const mappedResumes = resumesData.map((item, idx) => ({
        id: idx + 1,
        name: item.name || `Candidate ${idx + 1}`,
        Rank: item.score || 0,
        justification: item.justification || "",
        experience: extractYearsOfExperience(item.justification),
        email: item.email,
        phone: item.phone,
        keySkills: Array.isArray(item.keySkills) ? item.keySkills : [exeSkill],
      }));

      setSearchedResumes(mappedResumes);
    } catch (err) {
      console.error(err);
      setError("Error retrieving resumes.");
      setSearchedResumes([]);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  const combinedResumes = useMemo(() => [...uploadedResumes, ...searchedResumes], [uploadedResumes, searchedResumes]);

  const filteredResumes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const skillQuery = keySkillQuery.toLowerCase().trim();

    return combinedResumes.filter(r => {
      const rank = Number(r.Rank) || 0;
      const matchesSearch =
        r.name.toLowerCase().includes(q) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.justification && r.justification.toLowerCase().includes(q));

      const matchesSkill = skillQuery
        ? r.keySkills.some(skill => skill.toLowerCase().includes(skillQuery))
        : true;

      const inScoreRange = rank >= scoreRange[0] && rank <= scoreRange[1];
      const inExpRange = r.experience >= experienceRange[0] && r.experience <= experienceRange[1];
      const hasEmail = filterEmail ? Boolean(r.email) : true;
      const hasPhone = filterPhone ? Boolean(r.phone) : true;

      return matchesSearch && matchesSkill && inScoreRange && inExpRange && hasEmail && hasPhone;
    });
  }, [searchQuery, keySkillQuery, scoreRange, experienceRange, filterEmail, filterPhone, combinedResumes]);

  const renderScoreThumb = ({ index, props }) => (
    <div {...props} className="h-5 w-5 rounded-full bg-blue-600 shadow-md cursor-pointer" key={index}>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-cyan-400 to-blue-500 p-4">
      <div className="bg-white/80 shadow-lg rounded-xl w-full p-4 flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 bg-blue-100 rounded-xl p-4 shadow-md flex-shrink-0">
          <h3 className="font-bold text-blue-900 mb-5 text-xl">🔍 Filter Options</h3>
         <form
  className="mb-4"
  onSubmit={(e) => {
    e.preventDefault();
    fetchResumesByOrgId();
  }}
>
  <label className="font-semibold text-blue-800 block mb-2">Case ID </label>
  <input
    type="text"
    placeholder="Enter Case ID"
    value={orgId}
    onChange={e => setOrgId(e.target.value)}
    disabled={loading}
    className="w-full px-4 py-2 border border-blue-300 rounded-md"
  />
  <button
    type="submit"
    disabled={loading || !orgId.trim()}
    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full disabled:opacity-50"
  >
    {loading ? 'Searching...' : 'Search'}
  </button>
  {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
</form>
          {/* Search Input */}
           <input
            type="text"
            placeholder="Search ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            disabled={loading}
            className="mb-4 px-4 py-3 rounded-lg border border-blue-300 focus:outline-none text-gray-700"
          />

          {/* Score Range */}
          <label className="font-semibold text-blue-800 mb-3 block text-lg">Score Range</label>
            <div className="flex justify-between mb-3 text-blue-900 font-semibold text-sm">
            <span>{scoreRange[0]}</span><span>{scoreRange[1]}</span>
            </div>
          <Range
            step={1}
            min={1}
            max={10}
            values={scoreRange}
            onChange={setScoreRange}
            renderTrack={({ props, children }) => (
              <div {...props} style={{ ...props.style, height: '6px', backgroundColor: '#ddd' }}>
                <div
                  style={{
                    height: '6px',
                    backgroundColor: '#2563eb',
                    marginLeft: `${((scoreRange[0] - 1) / 9) * 100}%`,
                    width: `${((scoreRange[1] - scoreRange[0]) / 9) * 100}%`,
                  }}
                />
                {children}
              </div>
            )}
            renderThumb={renderScoreThumb}
          />

          {/* Experience Range */}
          <label className="font-semibold text-blue-800 mt-6 mb-3 block text-lg">Experience (years)</label>
          <div className="flex justify-between mb-3 text-blue-900 font-semibold text-sm">
            <span>{scoreRange[0]}</span><span>{scoreRange[1]}</span>
          </div>
          <Range
            step={1}
            min={0}
            max={10}
            values={experienceRange}
            onChange={setExperienceRange}
            renderTrack={({ props, children }) => (
              <div {...props} style={{ ...props.style, height: '6px', background: '#ddd' }}>
                <div
                  style={{
                    height: '6px',
                    width: `${((experienceRange[1] - experienceRange[0]) / 10) * 100}%`,
                    backgroundColor: '#2563eb',
                    marginLeft: `${(experienceRange[0] / 10) * 100}%`,
                  }}
                />
                {children}
              </div>
            )}
            renderThumb={({ index, props }) => (
              <div {...props} key={index} className="h-5 w-5 rounded-full bg-blue-600 shadow-md cursor-pointer">
                </div>
            )}
          />

          {/* Email and Phone */}
<div className="mt-6 flex flex-row gap-x-6">
  <label className="inline-flex items-center gap-2 text-blue-900 font-semibold cursor-pointer">
    <input
      type="checkbox"
      checked={filterEmail}
      onChange={() => setFilterEmail(!filterEmail)}
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      disabled={loading}
    />
    Email
  </label>

  <label className="inline-flex items-center gap-2 text-blue-900 font-semibold cursor-pointer">
    <input
      type="checkbox"
      checked={filterPhone}
      onChange={() => setFilterPhone(!filterPhone)}
      className="rounded border-gray-300 text-blue-600"
      disabled={loading}
    />
    Phone
  </label>
</div>

          {/* Key Skills */}
          <div>
            <h3 className="font-bold text-blue-900 mt-8 mb-3 text-xl">🛠️ Key Skills</h3>
            <div className="text-sm bg-white border border-blue-200 rounded-md p-3 text-blue-900 shadow-inner min-h-[40px]">
              {userKeySkills.length > 0 ? userKeySkills.join(', ') : 'No key skills available'}
            </div>
          </div>
        </div>

        {/* Resume List */}
        <motion.div layout className="flex-1 space-y-6 overflow-auto max-h-[80vh]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-3xl font-semibold text-blue-900">📄 Talent Sift</h2>
          </div>
<div className="flex justify-between items-center mb-4">
  {/* Left: Showing resumes */}
  <p className="text-blue-800 font-medium">
    Showing <span className="font-bold">{filteredResumes.length}</span> of{' '}
    <span className="font-bold">{combinedResumes.length}</span> resumes
  </p>

  {/* Right: Score Range */}
  <p className="text-blue-800 font-medium">
    <span className="font-bold"></span> Score Range 1 - 10
  </p>
</div>


          <ul className="space-y-4">
            {filteredResumes.length === 0 ? (
              <li className="text-blue-900 italic font-medium">No resumes found.</li>
            ) : (
              filteredResumes.map((resume) => (
                <motion.li
                  layout
                  key={resume.id}
                  className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 border border-blue-200 hover:shadow-xl transition-all duration-200"
                >
                  <div className="text-gray-900 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 w-full">
                    <div className="font-bold text-xl">{resume.name}</div>
                    <div className="text-blue-700 font-semibold">{resume.email || 'No email'}</div>
                    <div className="text-blue-700 font-semibold">{resume.phone || 'No phone'}</div>
                    <div className="mt-1 text-blue-900 font-semibold sm:mt-0">
                      Score: {resume.Rank} {getRankLabel(resume.Rank)}
                    </div>
                    <div className="mt-1 text-blue-900 font-semibold sm:mt-0">
                      Experience: {resume.experience} yrs
                    </div>
                  </div>

                  <div className="text-gray-800 mt-2 text-sm whitespace-pre-line">
                    {resume.justification}
                  </div>
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
