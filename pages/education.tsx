import { useState } from 'react';
import { useRouter } from 'next/router';

type Education = {
  schoolName: string;
  city: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description: string;
};

export default function EducationPage() {
  const router = useRouter();
  const [educations, setEducations] = useState<Education[]>([{
    schoolName: '',
    city: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    description: ''
  }]);

  const handleChange = (index: number, field: keyof Education, value: string) => {
    const newEducations = [...educations];
    newEducations[index] = {
      ...newEducations[index],
      [field]: value
    };
    setEducations(newEducations);
  };

  const handleNext = async () => {
    // 保存教育数据到localStorage
    localStorage.setItem('education', JSON.stringify(educations));

    // 收集所有数据
    const allData = {
      selectedJobs: JSON.parse(localStorage.getItem('selectedJobs') || '[]'),
      skills: JSON.parse(localStorage.getItem('skills') || '[]'),
      workExperience: JSON.parse(localStorage.getItem('workExperience') || '[]'),
      projectExperience: JSON.parse(localStorage.getItem('projectExperience') || '[]'),
      education: educations
    };

    try {
      // 发送数据到后端API
      const response = await fetch('/api/save-resume-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allData),
      });

      if (!response.ok) {
        throw new Error('Failed to save resume data');
      }

      // 保存成功后只提示成功，不进行导航
      alert('Resume data saved successfully');
      
    } catch (error) {
      console.error('Error saving resume data:', error);
      // 这里可以添加错误提示
      alert('Failed to save resume data');
    }
  };

  const addEducation = () => {
    setEducations([...educations, {
      schoolName: '',
      city: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      description: ''
    }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-8">
      {/* Sidebar */}
      <div className="w-1/4 bg-white rounded shadow p-4">
        <ul className="space-y-4 text-gray-600 text-sm">
          <li>Basic Info</li>
          <li>Professional Skills</li>
          <li>Work Experience</li>
          <li>Projects</li>
          <li className="text-emerald-600 font-semibold">Education</li>
          <li className="text-emerald-500 cursor-pointer">+ Add Custom Section</li>
        </ul>
      </div>

      {/* Form */}
      <div className="flex-1 bg-white rounded shadow p-8">
        <h2 className="text-xl font-bold mb-6">Education Experience</h2>

        {educations.map((education, index) => (
          <div key={index} className="mb-8 border-b pb-8">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name
                </label>
                <input
                  value={education.schoolName}
                  onChange={(e) => handleChange(index, 'schoolName', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  placeholder="Enter school name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  value={education.city}
                  onChange={(e) => handleChange(index, 'city', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree
                </label>
                <input
                  value={education.degree}
                  onChange={(e) => handleChange(index, 'degree', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  placeholder="Enter your degree"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Major
                </label>
                <input
                  value={education.major}
                  onChange={(e) => handleChange(index, 'major', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  placeholder="Enter your major"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="month"
                  lang="en"
                  value={education.startDate}
                  onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="month"
                  lang="en"
                  value={education.endDate}
                  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information
              </label>
              <textarea
                value={education.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md h-32 resize-none"
                placeholder="Enter additional information about your education..."
              />
            </div>
          </div>
        ))}

        <button
          onClick={addEducation}
          className="text-emerald-500 hover:text-emerald-700 mb-6"
        >
          + Add Another Education
        </button>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => router.push('/project-experience')}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
