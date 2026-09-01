import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { fetchUserProgress, toggleLessonCompleteDB, updateUserStreakDB, addXPDB, getWeekNumber } from '../services/progressService';

interface ProgressContextType {
  streak: number;
  xp: number;
  level: number;
  weeklyProgress: number;
  weeklyGoal: number;
  completedLessons: Record<string, boolean>;
  courseProgress: Record<string, number>;
  markLessonComplete: (courseId: string, lessonId: string | number) => void;
  checkDailyLogin: () => void;
  addXP: (amount: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Local state for UI (optimistic updates)
  const [streak, setStreak] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState('');
  const [xp, setXp] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [lastWeekCheck, setLastWeekCheck] = useState('');
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const weeklyGoal = 5;
  const level = Math.floor(xp / 1000) + 1;

  // 1. Load data from DB when user authenticates
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (!user?.id) return;
      
      const data = await fetchUserProgress(user.id);
      if (data && isMounted) {
        setStreak(data.streak_days);
        setXp(data.xp_total);
        setLastLoginDate(data.last_active_at?.split('T')[0] || '');
        // For weekly progress, we simulate it since it's not strictly tracked in v3 schema
        setWeeklyProgress(Math.min(Object.keys(data.completed_lessons).length % 5, 5));
        setCompletedLessons(data.completed_lessons);
        setCourseProgress(data.course_progress);
        setIsLoaded(true);
      }
    };
    
    loadData();
    
    return () => { isMounted = false; };
  }, [user]);

  // --- LOGIC: Daily Streak ---
  const checkDailyLogin = async () => {
    if (!isLoaded || !user?.id) return;
    const today = new Date().toISOString().split('T')[0];

    if (lastLoginDate !== today) {
      // Call Supabase RPC to securely handle the streak increment logic
      await updateUserStreakDB(user.id);
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastLoginDate === yesterdayStr) {
        setStreak(prev => prev + 1);
      } else if (lastLoginDate !== today && lastLoginDate !== '') {
        setStreak(1);
      } else if (lastLoginDate === '') {
        setStreak(1);
      }
      
      setLastLoginDate(today);
      addXP(50);
    }
  };

  // Run checks once loaded
  useEffect(() => {
    if (user && isLoaded) {
      checkDailyLogin();
    }
  }, [user, isLoaded]);

  // --- LOGIC: Gamification ---
  const addXP = async (amount: number) => {
    if (!user?.id) return;
    setXp(prev => prev + amount);
    await addXPDB(user.id, amount);
  };

  // --- LOGIC: Content Progress ---
  const markLessonComplete = async (courseId: string, lessonId: string | number) => {
    if (!user?.id) return;
    const key = `${courseId}_${lessonId}`;
    
    if (!completedLessons[key]) {
      setCompletedLessons(prev => ({ ...prev, [key]: true }));
      setWeeklyProgress(prev => Math.min(prev + 1, weeklyGoal));
      addXP(100);

      setCourseProgress(prev => {
        const current = prev[courseId] || 0;
        return { ...prev, [courseId]: Math.min(current + 10, 100) };
      });
      
      await toggleLessonCompleteDB(user.id, courseId, lessonId, true);
    } else {
      setCompletedLessons(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      
      setCourseProgress(prev => {
        const current = prev[courseId] || 0;
        return { ...prev, [courseId]: Math.max(current - 10, 0) };
      });
      
      await toggleLessonCompleteDB(user.id, courseId, lessonId, false);
    }
  };

  return (
    <ProgressContext.Provider value={{
      streak, xp, level, weeklyProgress, weeklyGoal,
      completedLessons, courseProgress,
      markLessonComplete, checkDailyLogin, addXP
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
