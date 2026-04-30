import { supabase } from './supabase';

export interface UserProgress {
  xp_total: number;
  level: number;
  streak_days: number;
  last_active_at: string;
  // We will build these two records by aggregating user_course_progress
  completed_lessons: Record<string, boolean>;
  course_progress: Record<string, number>;
}

/**
 * Fetch profile stats + course progress
 */
export async function fetchUserProgress(userId: string): Promise<UserProgress | null> {
  // 1. Fetch Profile
  const { data: profile, error: profError } = await supabase
    .from('profiles')
    .select('xp_total, level, streak_days, last_active_at')
    .eq('id', userId)
    .single();

  if (profError) {
    console.error('Error fetching user profile progress:', profError);
    return null;
  }

  // 2. Fetch Course Progress
  const { data: courses, error: courseErr } = await supabase
    .from('user_course_progress')
    .select('course_id, completed_lessons');

  const completed_lessons: Record<string, boolean> = {};
  const course_progress: Record<string, number> = {};

  if (!courseErr && courses) {
    for (const c of courses) {
      const cId = c.course_id;
      const arr: string[] = c.completed_lessons || [];
      // Populate global completed_lessons map
      arr.forEach(lessonId => {
        completed_lessons[`${cId}_${lessonId}`] = true;
      });
      // Rough estimation of course progress percent
      course_progress[cId] = Math.min(arr.length * 10, 100); 
    }
  }

  return {
    xp_total: profile.xp_total || 0,
    level: profile.level || 1,
    streak_days: profile.streak_days || 0,
    last_active_at: profile.last_active_at || '',
    completed_lessons,
    course_progress
  };
}

/**
 * Marks a lesson complete via Upsert. 
 * Since Supabase array append is tricky via REST, we'll fetch existing, append, and upsert.
 */
export async function toggleLessonCompleteDB(userId: string, courseId: string, lessonId: string | number, isComplete: boolean) {
  const lId = String(lessonId);
  const { data } = await supabase
    .from('user_course_progress')
    .select('completed_lessons')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  let lessons: string[] = data?.completed_lessons || [];
  
  if (isComplete && !lessons.includes(lId)) {
    lessons.push(lId);
  } else if (!isComplete) {
    lessons = lessons.filter(id => id !== lId);
  }

  await supabase
    .from('user_course_progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      completed_lessons: lessons,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, course_id' });
}

/**
 * Call the Supabase RPC to update the user streak.
 */
export async function updateUserStreakDB(userId: string) {
  await supabase.rpc('update_user_streak', { p_user_id: userId });
}

/**
 * Call the Supabase RPC to add XP and recalculate level.
 */
export async function addXPDB(userId: string, xpAmount: number) {
  await supabase.rpc('add_xp', { p_user_id: userId, p_xp: xpAmount });
}

export function getWeekNumber(d: Date): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${weekNo}`;
}
