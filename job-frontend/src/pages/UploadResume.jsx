import { useState, useRef } from 'react';
import { FiUpload, FiFile, FiX, FiCheckCircle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SkillTag from '../components/SkillTag';
import { allSkills } from '../data/student';

const UploadResume = () => {
  const { student, updateStudentSkills, addNotification } = useApp();
  const [file, setFile] = useState(null);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(student.skills);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(student.resumeUploaded);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        addNotification('Please upload a PDF or Word document', 'error');
        return;
      }

      setFile(selectedFile);
      processResume(selectedFile);
    }
  };

  const processResume = (file) => {
    setIsProcessing(true);

    // Simulate resume processing with a delay
    setTimeout(() => {
      // Simulate skill extraction (randomly select some skills)
      const simulatedSkills = allSkills
        .sort(() => 0.5 - Math.random())
        .slice(0, 8);
      
      setExtractedSkills(simulatedSkills);
      setIsProcessing(false);
      addNotification('Resume processed successfully!', 'success');
    }, 2000);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      processResume(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setExtractedSkills([]);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSaveSkills = () => {
    updateStudentSkills(selectedSkills);
    setUploadComplete(true);
    addNotification('Skills updated successfully!', 'success');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <FiUpload className="w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-bold">Upload Resume</h1>
        </div>
        <p className="text-green-100 text-lg">
          Upload your resume to extract skills and get better job recommendations
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Upload Your Resume
            </h2>

            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer bg-gray-50 dark:bg-gray-900"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Drag & Drop your resume here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  or click to browse
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Supported formats: PDF, DOC, DOCX (Max 5MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                      <FiFile className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {isProcessing && (
                  <div className="flex items-center gap-3 py-4">
                    <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Processing resume and extracting skills...
                    </span>
                  </div>
                )}

                {!isProcessing && extractedSkills.length > 0 && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 py-2">
                    <FiCheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Resume processed successfully!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Extracted Skills */}
          {extractedSkills.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-slide-up">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Extracted Skills
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                We found these skills in your resume. Click to select/deselect:
              </p>
              <div className="flex flex-wrap gap-2">
                {extractedSkills.map((skill, index) => (
                  <button
                    key={index}
                    onClick={() => toggleSkill(skill)}
                    className={`transition-all ${
                      selectedSkills.includes(skill) ? 'scale-105' : 'opacity-60'
                    }`}
                  >
                    <SkillTag
                      skill={skill}
                      variant={selectedSkills.includes(skill) ? 'success' : 'gray'}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current Skills */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Your Skills ({selectedSkills.length})
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              These skills will be used for job matching
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedSkills.length > 0 ? (
                selectedSkills.map((skill, index) => (
                  <SkillTag
                    key={index}
                    skill={skill}
                    variant="success"
                    onRemove={(skill) => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
                  />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                  No skills selected yet
                </p>
              )}
            </div>

            <button
              onClick={handleSaveSkills}
              disabled={selectedSkills.length === 0}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                selectedSkills.length === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
              }`}
            >
              Save Skills & Update Profile
            </button>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3">
              💡 Tips for Better Matching
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Upload an updated resume with all your skills</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Review and verify the extracted skills</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Add or remove skills to ensure accuracy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>More skills = better job recommendations!</span>
              </li>
            </ul>
          </div>

          {uploadComplete && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800 animate-scale-in">
              <div className="flex items-center gap-3 mb-3">
                <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="font-bold text-green-900 dark:text-green-300">
                  Profile Updated!
                </h3>
              </div>
              <p className="text-sm text-green-800 dark:text-green-300 mb-4">
                Your skills have been updated. Check out your personalized job recommendations!
              </p>
              <button
                onClick={() => window.location.href = '/student/dashboard'}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View Recommendations
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
