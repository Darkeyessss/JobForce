import { useState } from 'react';
import { useRouter } from 'next/router';

type ProjectExperience = {
  projectName: string;
  city: string;
  position: string;
  department: string;
  startDate: string;
  endDate: string;
  description: string;
};

export default function ProjectExperiencePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectExperience[]>([{
    projectName: '',
    city: '',
    position: '',
    department: '',
    startDate: '',
    endDate: '',
    description: ''
  }]);

  
  const handleChange = (index: number, field: keyof ProjectExperience, value: string) => {
    const newProjects = [...projects];
    newProjects[index] = {
      ...newProjects[index],
      [field]: value
    };
    setProjects(newProjects);
  };

  const handleNext = () => {
    localStorage.setItem('projectExperience', JSON.stringify(projects));
    router.push('/education');
  };

  const addProject = () => {
    setProjects([...projects, {
      projectName: '',
      city: '',
      position: '',
      department: '',
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
          <li className="text-emerald-600 font-semibold">Projects</li>
          <li>Education</li>
          <li className="text-emerald-500 cursor-pointer">+ Add Custom Section</li>
        </ul>
      </div>

      {/* Form */}
      <div className="flex-1 bg-white rounded shadow p-8">
        <h2 className="text-xl font-bold mb-6">Project Experience</h2>

        {projects.map((project, index) => (
          <div key={index} className="mb-8 border-b pb-8">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  value={project.projectName}
                  onChange={(e) => handleChange(index, 'projectName', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  value={project.city}
                  onChange={(e) => handleChange(index, 'city', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  value={project.position}
                  onChange={(e) => handleChange(index, 'position', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  placeholder="Enter your position"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  value={project.department}
                  onChange={(e) => handleChange(index, 'department', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  placeholder="Enter department"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="month"
                  lang="en"
                  value={project.startDate}
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
                  value={project.endDate}
                  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Description
              </label>
              <textarea
                value={project.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md h-32 resize-none"
                placeholder="Describe your project experience..."
              />
            </div>
          </div>
        ))}

        <button
          onClick={addProject}
          className="text-emerald-500 hover:text-emerald-700 mb-6"
        >
          + Add Another Project
        </button>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => router.push('/work-experience')}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 