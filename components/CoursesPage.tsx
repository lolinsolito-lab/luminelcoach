import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  LockClosedIcon,
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../hooks/useCourses';

const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const {
    filteredCourses,
    freeCourses,
    premiumCourses,
    vipCourses,
    isLoading,
    isCourseUnlocked,
    unlockCourse
  } = useCourses({
    userPlan: user?.plan || 'free',
    activeCategory,
    selectedLevel,
    searchQuery
  });

  const categories = ['all', 'Mindfulness', 'Health', 'Leadership', 'Relationships', 'Personal Growth'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const handleCourseClick = (courseId: string, coursePlan: string) => {
    const isUnlocked = isCourseUnlocked(courseId);

    if (isUnlocked) {
      navigate(`/courses/${courseId}`);
    } else {
      // Show upgrade prompt
      navigate('/plans');
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'free':
        return { label: 'FREE', color: 'bg-luminel-sage-100 dark:bg-luminel-sage-900/30 text-luminel-sage-700 dark:text-luminel-sage-400', icon: '🟢' };
      case 'premium':
        return { label: 'PREMIUM', color: 'bg-luminel-champagne dark:bg-luminel-taupe/30 text-luminel-smoke dark:text-luminel-taupe', icon: '⭐' };
      case 'vip':
        return { label: 'VIP', color: 'bg-luminel-gold-soft/20 dark:bg-luminel-gold-soft/10 text-luminel-gold-soft', icon: '👑' };
      default:
        return { label: 'FREE', color: 'bg-gray-100 text-gray-700', icon: '🟢' };
    }
  };

  const renderCourseCard = (course: any, idx: number) => {
    const isUnlocked = isCourseUnlocked(course.id);
    const planBadge = getPlanBadge(course.plan);

    return (
      <motion.div
        key={course.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
        onClick={() => handleCourseClick(course.id, course.plan)}
        className={`group cursor-pointer bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden border border-luminel-taupe/20 dark:border-slate-700 transition-all duration-300 ${isUnlocked ? 'hover:shadow-2xl hover:-translate-y-1' : 'opacity-75'
          }`}
      >
        {/* Thumbnail */}
        <div className={`aspect-video relative overflow-hidden`}>
          {/* Background Image or Gradient */}
          {course.image ? (
            <img
              src={course.image}
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${course.color}`} />
          )}

          {/* Overlay */}
          <div className={`absolute inset-0 ${isUnlocked ? 'bg-black/30 group-hover:bg-black/20' : 'bg-black/60'} transition-colors`} />

          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
              <div className="text-center">
                <LockClosedIcon className="w-12 h-12 text-white/80 mx-auto mb-2" />
                <p className="text-white font-bold text-sm tracking-wide uppercase">Upgrade to {course.plan}</p>
              </div>
            </div>
          )}

          {/* Icon (only if no image or if desired as overlay) - Optional, hiding if image exists for cleaner look, or keeping small */}
          {!course.image && isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl">{course.icon}</div>
            </div>
          )}

          {/* Plan Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1 ${planBadge.color} backdrop-blur-md rounded-full text-xs font-bold flex items-center gap-1 shadow-sm`}>
            <span>{planBadge.icon}</span>
            {planBadge.label}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-luminel-champagne text-luminel-smoke text-xs font-bold rounded-full">
              {course.level}
            </span>
            <span className="flex items-center gap-1 text-xs text-luminel-taupe">
              <ClockIcon className="w-4 h-4" />
              {course.duration}
            </span>
          </div>

          <h3 className={`text-lg font-bold text-luminel-smoke dark:text-white mb-2 transition-colors ${isUnlocked ? 'group-hover:text-luminel-gold-soft' : ''
            }`}>
            {course.title}
          </h3>

          <p className="text-sm text-luminel-taupe dark:text-slate-400 mb-4 line-clamp-2">
            {course.description}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-luminel-gold-soft to-luminel-taupe flex items-center justify-center text-white font-bold text-sm">
              {course.instructorAvatar}
            </div>
            <span className="text-sm text-luminel-taupe">{course.instructor}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-luminel-taupe/20">
            <div className="flex items-center gap-4 text-xs text-luminel-taupe">
              <div className="flex items-center gap-1">
                <StarSolid className="w-4 h-4 text-luminel-gold-soft" />
                <span className="font-bold">{course.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <UserGroupIcon className="w-4 h-4" />
                <span>{course.users.toLocaleString()}</span>
              </div>
            </div>

            {isUnlocked ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-luminel-gold-soft">Start</span>
                <div className="w-8 h-8 rounded-full bg-luminel-champagne flex items-center justify-center group-hover:bg-luminel-gold-soft transition-colors">
                  <span className="text-luminel-smoke group-hover:text-white text-lg">→</span>
                </div>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/plans');
                }}
                className="px-4 py-2 bg-gradient-to-r from-luminel-gold-soft to-luminel-taupe text-luminel-smoke rounded-xl text-xs font-bold hover:shadow-lg transition-all"
              >
                Unlock
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-luminel-champagne border-t-luminel-gold-soft rounded-full animate-spin mx-auto mb-4" />
          <p className="text-luminel-taupe">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-luminel-smoke dark:text-white mb-4">Course Library</h1>
        <p className="text-lg text-luminel-taupe dark:text-slate-300">
          Explore our collection of transformational courses
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luminel-taupe" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-luminel-taupe/20 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-luminel-gold-soft text-luminel-smoke dark:text-white"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${activeCategory === category
              ? 'bg-luminel-gold-soft text-luminel-smoke shadow-lg shadow-luminel-gold-soft/30'
              : 'bg-white dark:bg-slate-800 text-luminel-taupe border border-luminel-taupe/20 hover:border-luminel-gold-soft'
              }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Free Courses */}
      {freeCourses.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-luminel-sage-100 dark:bg-luminel-sage-900/30 flex items-center justify-center">
              <span className="text-2xl">🟢</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-luminel-smoke dark:text-white">Free Courses</h2>
              <p className="text-sm text-luminel-taupe">Available to everyone</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeCourses.map((course, idx) => renderCourseCard(course, idx))}
          </div>
        </div>
      )}

      {/* Premium Courses */}
      {premiumCourses.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-luminel-champagne flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-luminel-smoke dark:text-white">Premium Courses</h2>
              <p className="text-sm text-luminel-taupe">Unlock with Premium plan</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumCourses.map((course, idx) => renderCourseCard(course, idx))}
          </div>
        </div>
      )}

      {/* VIP Courses */}
      {vipCourses.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-luminel-gold-soft/20 flex items-center justify-center">
              <span className="text-2xl">👑</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-luminel-smoke dark:text-white">VIP Courses</h2>
              <p className="text-sm text-luminel-taupe">Exclusive to VIP members</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vipCourses.map((course, idx) => renderCourseCard(course, idx))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <AcademicCapIcon className="w-16 h-16 text-luminel-taupe/50 mx-auto mb-4" />
          <p className="text-luminel-taupe">No courses found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;