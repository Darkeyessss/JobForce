import { useState } from 'react';
import { useRouter } from 'next/router';

type JobGroup = { [key: string]: string[] };
type JobCategory = { [key: string]: JobGroup };

// 热门岗位推荐
const popularJobs = [
  'Frontend Software Engineer',
  'Data Scientist',
  'Product Manager',
  'Full Stack Engineer',
  'Machine Learning Engineer',
];

const jobData: JobCategory = {
  'Software/Internet/AI': {
    'Backend Engineering': ['Backend Engineer', 'Java Engineer', 'Python Engineer', '.Net Engineer', 'C/C++ Engineer', 'Golang Engineer', 'Full Stack Engineer', 'Blockchain Engineer', 'Salesforce Developer'],
    'Frontend/Mobile/Game': ['Frontend Software Engineer', 'React Developer', 'UI/UX Developer', 'iOS/Swift Developer', 'Android Developer', 'Flutter Developer', 'Unity Developer', 'Unreal Engine Developer', 'AR/VR Developer', 'Game Developer'],
    'Data/AI': ['Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'AI Researcher', 'NLP Engineer', 'Computer Vision Engineer', 'Data Engineer'],
    'DevOps/Infra': ['DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer', 'Infrastructure Engineer', 'Security Engineer'],
    'QA/Testing': ['QA Engineer', 'Automation Tester', 'Manual Tester'],
  },
  'Electrical Engineering': {
    'Hardware Design': ['Circuit Design Engineer', 'FPGA Engineer', 'Embedded Engineer'],
    'Technical Project Management': ['Project/Program Manager'],
    'Telecommunications': ['Telecommunications Engineer', 'Network Engineer', 'Wireless/Antenna Engineer'],
    'Electrical Vehicles': ['Battery Engineer', 'Motor Engineer'],
    'Aerospace Engineering': ['Aerospace Engineer'],
    'Sales & Technical Support': ['Sales Engineer', 'Solutions Architect'],
  },
  'Product': {
    'Product Management': [
      'Product Analyst',
      'Product Manager',
      'Technical Product Manager',
      'Product Manager, Consumer Software',
      'Product Manager, B2B/SaaS',
      'Product Manager, Hardware/Robotics/IoT',
      'AI Product Manager',
      'Game Designer',
    ],
  },
  'Creative & Design': {
    'UI/UX Design': ['Graphic Designer', 'UI Designer', 'UX Designer', 'UX Researcher'],
    'Art/3D/Animation': ['3D Designer', 'Animator', 'Illustrator', 'Video Editor', 'Creative/Art Director', 'Motion Designer'],
    'Environmental Design': ['Interior Designer', 'Landscape Designer'],
    'Industrial Design': ['Industrial Designer'],
  },
  'Consulting': {
    Strategy: ['Strategy Consultant'],
    Operations: ['Operations Consultant'],
  },
  'Finance': {
    'Corporate Finance': ['Corporate Finance Analyst', 'Treasury'],
    'Investment/Financing': [
      'Financial Analyst',
      'Risk Analyst',
      'Securities Trader',
      'Quantitative Analyst/Researcher',
      'Investment Manager',
      'Equity Analyst',
      'Asset Manager',
      'Portfolio Manager'
    ],
    Banking: [
      'Commercial Banker',
      'Investment Banker',
      'Credit Analyst',
      'Loan Officer'
    ],
    'VC/PE': [
      'Investment Analyst/Associate',
      'Investment Direct/VP',
      'Investment Partner',
      'Portfolio Operations Manager',
      'Fundraising Manager',
      'Investor Relations Manager'
    ],
    Insurance: ['Actuary', 'Underwriter']
  },
  'Accounting': {
    Accounting: ['Accountant', 'Controller'],
    'Tax and Audit': ['Tax Specialist', 'Auditor'],
  },
  'Healthcare': {
    'Healthcare IT': [
      'Healthcare Data Analyst',
      'Healthcare Data Scientist',
      'Healthcare IT Specialist',
      'EHR (Electronic Health Records) System Administrator'
    ],
    'Biomedical Engineering & Technology': [
      'Biomedical Engineer',
      'Clinical Engineer',
      'Biomedical Equipment Technician'
    ],
    'Drug Discovery & Development': [
      'Biologist',
      'Pharmacologist',
      'Chemist',
      'Biochemist',
      'Formulation Scientist',
      'Toxicologist',
      'DMPK Scientist'
    ],
    'Clinical & Regulatory': [
      'Clinical Research Scientist',
      'Clinical Research Associate',
      'Biostatistician',
      'Regulatory Affairs Specialist',
      'Medical Writer'
    ],
    'Health Product & Operations Management': [
      'Health Product Manager',
      'Clinical Operations Manager',
      'Healthcare Compliance Manager',
      'Healthcare Quality Improvement Specialist'
    ]
  },
  'Marketing': {
    'SEO and Content Marketing': ['Content Marketing/Strategy', 'SEO', 'Social Media Management', 'Copywriter'],
    'Product Marketing': ['Product Marketing'],
    'Brand and Communications Marketing': ['Brand Manager', 'Public Relations', 'Community Manager', 'Event Marketing Specialist'],
    'Growth Marketing': ['Growth Marketing', 'Advertising Specialist', 'Performance Marketing'],
    'Lifecycle and Email Marketing': ['Lifecycle Marketing', 'Email Marketing']
  }
};

export default function JobForcePage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  const handleJobSelect = (job: string) => {
    if (selectedJobs.includes(job)) {
      setSelectedJobs(selectedJobs.filter(j => j !== job));
    } else if (selectedJobs.length < 5) {
      setSelectedJobs([...selectedJobs, job]);
    }
  };


  const handleSaveConfig = () => {
    // Create config object with numbered keys
    const config = selectedJobs.reduce((acc, job, index) => {
      acc[index + 1] = job;
      return acc;
    }, {} as { [key: number]: string });

    // Create and download config.json file
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.location.href = '/basic_info';
  };

  // 将已选择的岗位分组为每组3个
  const selectedJobRows = selectedJobs.reduce((acc, job, index) => {
    const rowIndex = Math.floor(index / 3);
    if (!acc[rowIndex]) {
      acc[rowIndex] = [];
    }
    acc[rowIndex].push(job);
    return acc;
  }, [] as string[][]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-10">JobForce</h1>
      
      <div className="w-full max-w-4xl">
        <div className="relative">
          <div className="border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-emerald-400 bg-white">
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedJobs.map((job) => (
                <div
                  key={job}
                  className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm flex items-center justify-between shadow-sm hover:bg-emerald-50 transition-colors"
                >
                  <span className="truncate font-medium">{job}</span>
                  <button
                    onClick={() => handleJobSelect(job)}
                    className="ml-1.5 text-emerald-500 hover:text-emerald-700 flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your job interests..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSelectedCategory(null)}
                className="flex-1 outline-none text-gray-600"
              />
              {selectedJobs.length > 0 && (
                <button
                  onClick={handleSaveConfig}
                  className="px-6 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors whitespace-nowrap"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {5 - selectedJobs.length} positions remaining
          </p>
        </div>

        {/* Popular Jobs */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Popular Positions:</p>
          <div className="flex flex-wrap gap-2">
            {popularJobs.map((job) => (
              <button
                key={job}
                onClick={() => handleJobSelect(job)}
                disabled={selectedJobs.length >= 5 && !selectedJobs.includes(job)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedJobs.includes(job)
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-50'
                    : selectedJobs.length >= 5
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-500 hover:text-emerald-600'
                }`}
              >
                {job}
              </button>
            ))}
          </div>
        </div>
      </div>

      {query !== '' && (
        <div className="mt-4 flex w-full max-w-4xl border rounded-lg shadow">
          <div className="w-1/3 border-r bg-gray-100 p-4 overflow-y-auto max-h-96">
            {Object.keys(jobData).map((category) => (
              <div
                key={category}
                className={`cursor-pointer p-2 rounded hover:bg-emerald-50 ${
                  selectedCategory === category ? 'bg-emerald-100 text-emerald-700 font-semibold' : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </div>
            ))}
          </div>
          <div className="w-2/3 p-4 overflow-y-auto max-h-96">
            {selectedCategory &&
              Object.entries(jobData[selectedCategory]).map(([group, roles]) => (
                <div key={group} className="mb-4">
                  <h3 className="font-semibold mb-2">{group}</h3>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <span
                        key={role}
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                          selectedJobs.includes(role)
                            ? 'bg-emerald-100 text-emerald-700'
                            : selectedJobs.length >= 5
                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-500 hover:text-emerald-600'
                        }`}
                        onClick={() => selectedJobs.length < 5 || selectedJobs.includes(role) ? handleJobSelect(role) : null}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
