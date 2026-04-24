import { useState, useEffect } from 'react';
import coursesData from '../data/courses.json';

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  plan: 'free' | 'premium' | 'vip';
  image: string;
  icon: string;
  color: string;
  unlockColor: string;
  modules: number;
  rating: number;
  users: number;
  category: string;
  progress: number;
  instructor: string;
  instructorAvatar: string;
}

interface UseCoursesParams {
  userPlan: string | null;
  activeCategory?: string;
  selectedLevel?: string;
  searchQuery?: string;
}

export function useCourses({
  userPlan,
  activeCategory = 'all',
  selectedLevel = 'all',
  searchQuery = ''
}: UseCoursesParams) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [unlockedCourses, setUnlockedCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        setCourses(coursesData as Course[]);

        // Load unlocked courses from localStorage
        const storedUnlockedCourses = localStorage.getItem('unlockedCourses');
        if (storedUnlockedCourses) {
          setUnlockedCourses(JSON.parse(storedUnlockedCourses));
        } else {
          // Set at least one free course as unlocked by default
          const defaultUnlocked = ['meditation-fundamentals'];
          setUnlockedCourses(defaultUnlocked);
          localStorage.setItem('unlockedCourses', JSON.stringify(defaultUnlocked));
        }

        // Auto-unlock courses based on user plan
        if (userPlan) {
          autoUnlockCoursesByPlan(userPlan);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [userPlan]);

  // Auto-unlock courses based on plan
  const autoUnlockCoursesByPlan = (plan: string) => {
    let coursesToUnlock: string[] = [];

    if (plan === 'free' || plan === 'premium' || plan === 'vip') {
      // Unlock all free courses
      coursesToUnlock = courses.filter(course => course.plan === 'free').map(course => course.id);
    }

    if (plan === 'premium' || plan === 'vip') {
      // Also unlock premium courses
      const premiumCourses = courses.filter(course => course.plan === 'premium').map(course => course.id);
      coursesToUnlock = [...coursesToUnlock, ...premiumCourses];
    }

    if (plan === 'vip') {
      // Also unlock VIP courses
      const vipCourses = courses.filter(course => course.plan === 'vip').map(course => course.id);
      coursesToUnlock = [...coursesToUnlock, ...vipCourses];
    }

    // Update unlocked courses
    setUnlockedCourses(prev => {
      const newUnlocked = [...new Set([...prev, ...coursesToUnlock])];
      localStorage.setItem('unlockedCourses', JSON.stringify(newUnlocked));
      return newUnlocked;
    });
  };

  // Filter courses by category, level, and search
  useEffect(() => {
    if (courses.length > 0) {
      const filtered = courses.filter(course => {
        const matchesCategory = activeCategory === 'all' || course.category.toLowerCase() === activeCategory.toLowerCase();
        const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase() === selectedLevel.toLowerCase();
        const matchesSearch = !searchQuery ||
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesLevel && matchesSearch;
      });

      setFilteredCourses(filtered);
    }
  }, [courses, activeCategory, selectedLevel, searchQuery]);

  // Unlock a specific course
  const unlockCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return false;

    let canUnlock = false;

    if (course.plan === 'free') {
      canUnlock = true;
    } else if (course.plan === 'premium' && (userPlan === 'premium' || userPlan === 'vip')) {
      canUnlock = true;
    } else if (course.plan === 'vip' && userPlan === 'vip') {
      canUnlock = true;
    }

    if (canUnlock && !unlockedCourses.includes(courseId)) {
      setUnlockedCourses(prev => {
        const newUnlocked = [...prev, courseId];
        localStorage.setItem('unlockedCourses', JSON.stringify(newUnlocked));
        return newUnlocked;
      });
      return true;
    }

    return false;
  };

  // Check if course is unlocked
  const isCourseUnlocked = (courseId: string) => {
    return unlockedCourses.includes(courseId);
  };

  // Split courses by plan
  const freeCourses = filteredCourses.filter(course => course.plan === 'free');
  const premiumCourses = filteredCourses.filter(course => course.plan === 'premium');
  const vipCourses = filteredCourses.filter(course => course.plan === 'vip');

  return {
    courses,
    filteredCourses,
    freeCourses,
    premiumCourses,
    vipCourses,
    unlockedCourses,
    isLoading,
    unlockCourse,
    isCourseUnlocked
  };
}
