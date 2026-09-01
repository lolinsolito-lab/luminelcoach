// DataService.tsx - Service layer for Make/Sheets integration
// This will handle all external data fetching and mutations

export interface UserProgress {
    streak: number;
    xp: number;
    level: number;
    weeklyProgress: number;
    weeklyGoal: number;
    questsCompleted: number;
}

export interface CalendarEvent {
    id: string;
    title: string;
    type: 'session' | 'course' | 'meditation' | 'calm' | 'personal';
    date: Date;
    time: string;
    duration: number;
    trainer?: string;
    plan: 'free' | 'premium' | 'vip';
    completed: boolean;
    booked: boolean;
    description: string;
}

export interface TimelineEvent {
    id: number;
    date: string;
    type: 'milestone' | 'quest' | 'achievement';
    title: string;
    icon: string;
    progress?: number;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: Date;
}

class DataService {
    private baseUrl: string;

    constructor() {
        // This will be your Make webhook URL
        // Example: 'https://hook.eu1.make.com/YOUR_WEBHOOK_ID'
        this.baseUrl = process.env.REACT_APP_MAKE_WEBHOOK_URL || '';
    }

    /**
     * Fetch user progress data from Make/Sheets
     * Make scenario should query Google Sheets and return user stats
     */
    async fetchUserProgress(userId: string): Promise<UserProgress> {
        try {
            // In production, this will call your Make webhook
            // const response = await fetch(`${this.baseUrl}/progress?userId=${userId}`);
            // const data = await response.json();
            // return data;

            // For now, return mock data (will be replaced when Make is connected)
            return {
                streak: 2,
                xp: 100,
                level: 1,
                weeklyProgress: 0,
                weeklyGoal: 3,
                questsCompleted: 0
            };
        } catch (error) {
            console.error('Error fetching user progress:', error);
            throw error;
        }
    }

    /**
     * Fetch calendar events from Make/Sheets
     * Make scenario should query Google Sheets events table
     */
    async fetchCalendarEvents(userId: string): Promise<CalendarEvent[]> {
        try {
            // In production:
            // const response = await fetch(`${this.baseUrl}/events?userId=${userId}`);
            // const data = await response.json();
            // return data.map(event => ({ ...event, date: new Date(event.date) }));

            // Mock data for now
            return [
                {
                    id: 'session-1',
                    title: "Mindful Stretching",
                    type: "session",
                    date: new Date(),
                    time: "11:00",
                    duration: 45,
                    trainer: "Elena",
                    plan: "free",
                    completed: false,
                    booked: true,
                    description: "Sessione di stretching consapevole per rilassare corpo e mente"
                },
                {
                    id: 'meditation-1',
                    title: "Respirazione Consapevole",
                    type: "meditation",
                    date: new Date(),
                    time: "18:30",
                    duration: 15,
                    plan: "free",
                    completed: false,
                    booked: true,
                    description: "Pratica di respirazione per centrarsi e trovare calma"
                }
            ];
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            throw error;
        }
    }

    /**
     * Fetch timeline events for progress tracking
     * Make scenario should query user activity history
     */
    async fetchTimelineEvents(userId: string): Promise<TimelineEvent[]> {
        try {
            // In production:
            // const response = await fetch(`${this.baseUrl}/timeline?userId=${userId}`);
            // return await response.json();

            // Mock data
            return [
                { id: 1, date: '2024-11-30', type: 'milestone', title: 'Prima settimana completata!', icon: '🎯' },
                { id: 2, date: '2024-11-28', type: 'quest', title: 'Emotional Intelligence Mastery', progress: 35, icon: '📚' },
                { id: 3, date: '2024-11-25', type: 'achievement', title: 'Streak di 7 giorni', icon: '🔥' }
            ];
        } catch (error) {
            console.error('Error fetching timeline events:', error);
            throw error;
        }
    }

    /**
     * Fetch user achievements
     * Make scenario should calculate achievements based on user data
     */
    async fetchAchievements(userId: string): Promise<Achievement[]> {
        try {
            // In production:
            // const response = await fetch(`${this.baseUrl}/achievements?userId=${userId}`);
            // return await response.json();

            // Mock data
            return [
                {
                    id: 'streak-7',
                    title: 'Streak Master',
                    description: '7 giorni consecutivi',
                    icon: 'fire',
                    unlocked: true,
                    unlockedAt: new Date('2024-11-25')
                },
                {
                    id: 'quests-10',
                    title: 'Quest Champion',
                    description: 'Completa 10 quest',
                    icon: 'trophy',
                    unlocked: false
                },
                {
                    id: 'days-30',
                    title: 'Transformation',
                    description: '30 giorni attivo',
                    icon: 'sparkles',
                    unlocked: false
                }
            ];
        } catch (error) {
            console.error('Error fetching achievements:', error);
            throw error;
        }
    }

    /**
     * Create a new calendar event
     * Make scenario should append to Google Sheets
     */
    async createEvent(userId: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> {
        try {
            // In production:
            // const response = await fetch(`${this.baseUrl}/events`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ userId, ...eventData })
            // });
            // return await response.json();

            // Mock implementation
            const newEvent: CalendarEvent = {
                id: `custom-${Date.now()}`,
                title: eventData.title || 'New Event',
                type: eventData.type || 'personal',
                date: eventData.date || new Date(),
                time: eventData.time || '12:00',
                duration: eventData.duration || 30,
                plan: 'free',
                completed: false,
                booked: true,
                description: eventData.description || ''
            };
            return newEvent;
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }

    /**
     * Update event booking status
     * Make scenario should update Google Sheets row
     */
    async toggleEventBooking(eventId: string, booked: boolean): Promise<void> {
        try {
            // In production:
            // await fetch(`${this.baseUrl}/events/${eventId}`, {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ booked })
            // });

            console.log(`Event ${eventId} booking toggled to ${booked}`);
        } catch (error) {
            console.error('Error toggling event booking:', error);
            throw error;
        }
    }

    /**
     * Mark event as completed
     * Make scenario should update Google Sheets and calculate XP
     */
    async completeEvent(eventId: string): Promise<void> {
        try {
            // In production:
            // await fetch(`${this.baseUrl}/events/${eventId}/complete`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' }
            // });

            console.log(`Event ${eventId} marked as completed`);
        } catch (error) {
            console.error('Error completing event:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const dataService = new DataService();

// Example Make.com Integration Guide:
/*
MAKE.COM SETUP GUIDE
====================

1. CREATE WEBHOOKS in Make.com:
   - GET /progress?userId={userId} → Query Sheets "user_progress" tab
   - GET /events?userId={userId} → Query Sheets "calendar_events" tab
   - GET /timeline?userId={userId} → Query Sheets "timeline" tab
   - GET /achievements?userId={userId} → Query Sheets "achievements" tab
   - POST /events → Append to Sheets "calendar_events" tab
   - PATCH /events/{eventId} → Update Sheets row
   - POST /events/{eventId}/complete → Update Sheets + calculate XP

2. GOOGLE SHEETS STRUCTURE:

   Sheet: "user_progress"
   Columns: user_id, streak, xp, level, weekly_progress, weekly_goal, quests_completed

   Sheet: "calendar_events"
   Columns: id, user_id, title, type, date, time, duration, trainer, plan, completed, booked, description

   Sheet: "timeline"
   Columns: id, user_id, date, type, title, icon, progress

   Sheet: "achievements"
   Columns: id, user_id, title, description, icon, unlocked, unlocked_at

3. CONNECT TO APP:
   - Set environment variable REACT_APP_MAKE_WEBHOOK_URL in .env
   - Make webhooks will automatically be called by DataService
   - Update ProgressContext to use dataService.fetchUserProgress()
   - Update CalendarPage to use dataService.fetchCalendarEvents()
   - Update ProgressTracking to use dataService.fetchTimelineEvents() and fetchAchievements()
*/
