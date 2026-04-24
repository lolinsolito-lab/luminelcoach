
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';

interface ProgressContextType {
  streak: number;
  xp: number;
  level: number;
  weeklyProgress: number;
  weeklyGoal: number;
  completedLessons: Record<string, boolean>; // format: "courseId_lessonId": true
  courseProgress: Record<string, number>; // format: "courseId": 45 (percentage)
  markLessonComplete: (courseId: string, lessonId: string | number) => void;
  checkDailyLogin: () => void;
  addXP: (amount: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // --- DATABASE STATE (Persisted in LocalStorage) ---
  const [streak, setStreak] = useLocalStorage<number>('luminel_streak', 0);
  const [lastLoginDate, setLastLoginDate] = useLocalStorage<string>('luminel_last_login', '');
  const [xp, setXp] = useLocalStorage<number>('luminel_xp', 0);
  const [weeklyProgress, setWeeklyProgress] = useLocalStorage<number>('luminel_weekly_progress', 0);
  const [lastWeekCheck, setLastWeekCheck] = useLocalStorage<string>('luminel_week_check', '');
  
  // Lesson tracking: map of "courseId_lessonId" -> boolean
  const [completedLessons, setCompletedLessons] = useLocalStorage<Record<string, boolean>>('luminel_completed_lessons', {});
  const [courseProgress, setCourseProgress] = useLocalStorage<Record<string, number>>('luminel_course_progress_percent', {});

  const weeklyGoal = 5; // Default goal
  const level = Math.floor(xp / 1000) + 1;

  // --- LOGIC: Daily Streak & Weekly Reset ---
  const checkDailyLogin = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check Weekly Reset (Sunday)
    const currentWeek = getWeekNumber(new Date());
    if (lastWeekCheck !== currentWeek) {
      setWeeklyProgress(0);
      setLastWeekCheck(currentWeek);
    }

    // Check Streak
    if (lastLoginDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastLoginDate === yesterdayStr) {
        setStreak(prev => prev + 1);
      } else if (lastLoginDate !== today) {
        // Streak broken (unless it's the very first login)
        if (lastLoginDate) {
           setStreak(1);
        } else {
           setStreak(1);
        }
      }
      
      setLastLoginDate(today);
      // Award daily login XP
      addXP(50);
    }
  };

  // --- LOGIC: Gamification ---
  const addXP = (amount: number) => {
    setXp(prev => prev + amount);
  };

  // --- LOGIC: Content Progress ---
  const markLessonComplete = (courseId: string, lessonId: string | number) => {
    const key = `${courseId}_${lessonId}`;
    
    if (!completedLessons[key]) {
      // Mark as complete
      const newCompleted = { ...completedLessons, [key]: true };
      setCompletedLessons(newCompleted);
      
      // Update Weekly Progress (1 lesson = 1 unit of progress)
      setWeeklyProgress(prev => Math.min(prev + 1, weeklyGoal));
      
      // Add XP
      addXP(100);

      // Recalculate Course Percentage (Simplified logic for simulation)
      // In a real DB, we would query total lessons. Here we simulate incrementing.
      setCourseProgress(prev => {
        const current = prev[courseId] || 0;
        // Increment by ~10% per lesson up to 100%, just for visual feedback in this demo
        return { ...prev, [courseId]: Math.min(current + 10, 100) };
      });
    } else {
      // Toggle off (optional, mostly for testing)
      const newCompleted = { ...completedLessons };
      delete newCompleted[key];
      setCompletedLessons(newCompleted);
      
      setCourseProgress(prev => {
        const current = prev[courseId] || 0;
        return { ...prev, [courseId]: Math.max(current - 10, 0) };
      });
    }
  };

  // Run checks on mount if user exists
  useEffect(() => {
    if (user) {
      checkDailyLogin();
    }
  }, [user]);

  // Helper for week number
  const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${weekNo}`;
  };

  return (
    <ProgressContext.Provider value={{
      streak,
      xp,
      level,
      weeklyProgress,
      weeklyGoal,
      completedLessons,
      courseProgress,
      markLessonComplete,
      checkDailyLogin,
      addXP
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
