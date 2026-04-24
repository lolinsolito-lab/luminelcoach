
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LockClosedIcon, 
  ClockIcon, 
  AcademicCapIcon, 
  UserGroupIcon,
  StarIcon,
  ChevronDownIcon
} from '@heroicons/react/24/solid';
import { Course } from '../types';

interface CourseSectionListProps {
  title: string;
  icon: string;
  planType: 'free' | 'premium' | 'vip';
  courses: Course[];
  unlockedCourses?: string[];
  onUnlock?: (plan: 'premium' | 'vip') => void;
  onClick: (id: string) => void;
  gridCols?: string;
  gapSize?: string;
  userPlan: string;
}

const CourseSectionList: React.FC<CourseSectionListProps> = React.memo(({
  title,
  icon,
  planType,
  courses,
  unlockedCourses = [],
  onUnlock,
  onClick,
  gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  gapSize = 'gap-6',
  userPlan
}) => {
  // Show 4 initially (1 row on large screens) to encourage interaction
  const INITIAL_LIMIT = 4;
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
  
  const isLockedPlan = (plan: string): boolean => {
    if (userPlan === 'vip') return false;
    if (userPlan === 'premium' && plan === 'vip') return true;
    if (userPlan === 'free' && (plan === 'premium' || plan === 'vip')) return true;
    return false;
  };

  const isSectionLocked = isLockedPlan(planType);
  const visibleCourses = courses.slice(0, displayLimit);
  const hasMore = courses.length > displayLimit;

  const handleLoadMore = () => {
    // Expand to show all if clicked
    setDisplayLimit(courses.length);
  };

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
        {isSectionLocked && (
          <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
            Locked
          </span>
        )}
        <span className="text-sm text-slate-400 font-medium ml-auto">
          {courses.length} corsi
        </span>
      </div>

      <div className={`grid ${gridCols} ${gapSize}`}>
        <AnimatePresence>
          {visibleCourses.map((course, idx) => {
            const isCourseUnlocked = unlockedCourses.includes(course.id);
            const isLocked = isSectionLocked && !isCourseUnlocked;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: idx * 0.05 }} 
                onClick={() => onClick(course.id)}
                className={`group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col`}
              >
                {/* Image Header with Lazy Loading */}
                <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    loading="lazy" 
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isLocked ? 'grayscale filter contrast-125' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg backdrop-blur-md bg-white/20 border border-white/30 text-white"
                    >
                      {course.icon}
                    </div>
                    {course.progress > 0 && !isLocked && (
                      <div className="px-3 py-1 bg-green-500/90 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg">
                        {course.progress}%
                      </div>
                    )}
                  </div>

                  {/* Locked Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-white">
                      <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-2">
                          <LockClosedIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-bold text-sm tracking-wide uppercase">Piano {planType}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onUnlock && (planType === 'premium' || planType === 'vip')) {
                              onUnlock(planType);
                          }
                        }}
                        className="mt-3 px-5 py-2 bg-white text-slate-900 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors shadow-lg"
                      >
                        Sblocca Ora
                      </button>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-opacity-10`} style={{ backgroundColor: course.color, color: course.color }}>
                      {course.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <StarIcon className="w-3 h-3" />
                      {course.rating}
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-slate-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                    {course.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs font-medium text-slate-400 pt-4 border-t border-slate-50 mt-auto">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <AcademicCapIcon className="w-4 h-4" />
                        {course.modulesCount} Moduli
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserGroupIcon className="w-4 h-4" />
                      {course.users}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* View All Button */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-indigo-50 text-indigo-600 rounded-full font-bold text-sm hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-sm hover:shadow-md"
          >
            Guarda tutti i corsi ({courses.length}) <ChevronDownIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
});

export default CourseSectionList;
