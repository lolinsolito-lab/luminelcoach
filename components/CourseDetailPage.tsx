import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
        Course Detail - Coming Soon
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-4">
        Course ID: {courseId}
      </p>
      <button
        onClick={() => navigate('/courses')}
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
      >
        Back to Courses
      </button>
    </div>
  );
};

export default CourseDetailPage;
