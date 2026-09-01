import { useState, useEffect, useMemo } from 'react';
import coursesData from '../data/courses.json';

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  plan: 'free' | 'starter' | 'premium' | 'vip';
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

const PLAN_ORDER: Record<string, number> = { free: 0, starter: 1, premium: 2, vip: 3 };

export function useCourses({
  userPlan,
  activeCategory = 'all',
  selectedLevel = 'all',
  searchQuery = ''
}: UseCoursesParams) {
  const [courses] = useState<Course[]>(coursesData as Course[]);
  const [unlockedCourses, setUnlockedCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Init unlocked courses based on plan
  useEffect(() => {
    const plan = userPlan ?? 'free';
    const unlocked = courses
      .filter(c => PLAN_ORDER[plan] >= PLAN_ORDER[c.plan])
      .map(c => c.id);
    setUnlockedCourses(unlocked);
    setIsLoading(false);
  }, [userPlan, courses]);

  // Filter courses — supporta italiano, inglese e "all"
  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const cat = activeCategory.toLowerCase();
    const lvl = selectedLevel.toLowerCase();

    return courses.filter(course => {
      // Categoria: "all" mostra tutto, altrimenti match case-insensitive
      const matchCat = cat === 'all' || course.category.toLowerCase() === cat;

      // Livello: supporta "tutti" e "all"
      const courseLvl = course.level.toLowerCase();
      const matchLevel =
        lvl === 'all' ||
        courseLvl === 'tutti' ||
        courseLvl === lvl ||
        (lvl === 'beginner' && (courseLvl === 'principiante' || courseLvl === 'beginner')) ||
        (lvl === 'intermediate' && (courseLvl === 'intermedio' || courseLvl === 'intermediate')) ||
        (lvl === 'advanced' && (courseLvl === 'avanzato' || courseLvl === 'advanced')) ||
        (lvl === 'principiante' && (courseLvl === 'beginner' || courseLvl === 'principiante')) ||
        (lvl === 'intermedio' && (courseLvl === 'intermediate' || courseLvl === 'intermedio')) ||
        (lvl === 'avanzato' && (courseLvl === 'advanced' || courseLvl === 'avanzato'));

      // Ricerca su titolo, descrizione e istruttore
      const matchSearch =
        q === '' ||
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        course.instructor.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q);

      return matchCat && matchLevel && matchSearch;
    });
  }, [courses, activeCategory, selectedLevel, searchQuery]);

  // Split per tier
  const freeCourses = useMemo(() => filteredCourses.filter(c => c.plan === 'free'), [filteredCourses]);
  const starterCourses = useMemo(() => filteredCourses.filter(c => c.plan === 'starter'), [filteredCourses]);
  const premiumCourses = useMemo(() => filteredCourses.filter(c => c.plan === 'premium'), [filteredCourses]);
  const vipCourses = useMemo(() => filteredCourses.filter(c => c.plan === 'vip'), [filteredCourses]);

  // Check se il corso è accessibile
  const isCourseUnlocked = (courseId: string) => unlockedCourses.includes(courseId);

  // Unlock manuale (es. acquisto singolo in futuro)
  const unlockCourse = (courseId: string): boolean => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return false;
    const plan = userPlan ?? 'free';
    const canUnlock = PLAN_ORDER[plan] >= PLAN_ORDER[course.plan];
    if (canUnlock && !unlockedCourses.includes(courseId)) {
      setUnlockedCourses(prev => [...prev, courseId]);
      return true;
    }
    return false;
  };

  return {
    courses,
    filteredCourses,
    freeCourses,
    starterCourses,
    premiumCourses,
    vipCourses,
    unlockedCourses,
    isLoading,
    unlockCourse,
    isCourseUnlocked,
  };
}