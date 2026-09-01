import { ReactNode } from 'react';

export interface UserStats {
  level: number;
  experience: number;
  experienceToNext: number;
  weeklyGoal: number;
  weeklyProgress: number;
  currentStreak: number;
  totalMinutes: number;
}

export interface Recommendation {
  id: string;
  title: string;
  subtitle: string;
  duration: number; // in minutes
  type: 'meditation' | 'workout' | 'journaling' | 'course';
  color: string;
}

export interface DailyTip {
  title: string;
  content: string;
  category: 'mindfulness' | 'productivity' | 'wellness';
}

export interface Session {
  id: string;
  title: string;
  instructor: string;
  time: string;
  image: string;
}

export interface NavItem {
  icon: ReactNode;
  label: string;
  id: string;
}

// UserProfile è definito e gestito da AuthContext (Supabase-ready)
// Re-esportato qui per compatibilità con i componenti che lo importano da 'types'
export type { UserProfile } from './contexts/AuthContext';


export interface Lesson {
  id: string | number;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  progress: number; // 0 to 100
  videoUrl?: string; // For future real implementation
}

export interface Module {
  id: string | number;
  title: string;
  duration: string;
  lessons: Lesson[];
}

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
  modulesCount: number; // Renamed to avoid confusion with the full array
  rating: number;
  users: number;
  category: string;
  progress: number;
  content?: Module[]; // The actual content structure
}

export interface Practice {
  id: string;
  title: string;
  description: string;
  duration: string; // "5 min"
  category: 'meditation' | 'breathwork' | 'focus' | 'sleep';
  image: string;
  locked: boolean;
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    level: number;
  };
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
  likedByCurrentUser: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}