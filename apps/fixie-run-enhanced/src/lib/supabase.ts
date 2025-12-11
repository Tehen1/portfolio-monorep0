import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types (matching your schema)
export interface PortfolioUser {
  id: string;
  email: string;
  wallet_addresses: string[];
  primary_domain: string;
  domains_engaged: string[];
  country_code: string;
  preferred_language: string;
  created_at: string;
  updated_at: string;
}

export interface UserDomainActivity {
  id: string;
  user_id: string;
  domain: string;
  activity_type: string;
  value_eur: number;
  activity_data: any;
  created_at: string;
  metadata?: any;
}

export interface UserRewards {
  id: string;
  user_id: string;
  reward_id: string;
  reward_amount: number;
  claimed_at: string;
  metadata?: any;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  domain: string;
  type: 'distance' | 'calories' | 'streak' | 'social' | 'custom';
  target_value: number;
  reward_tokens: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  max_participants?: number;
  created_by?: string;
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  current_progress: number;
  joined_at: string;
  completed_at?: string;
  is_completed: boolean;
}

// Helper functions for common queries
export const supabaseHelpers = {
  // Get user profile
  getUserProfile: async (userId: string): Promise<PortfolioUser | null> => {
    const { data, error } = await supabase
      .from('portfolio_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  },

  // Get user activities for a domain
  getUserActivities: async (userId: string, domain: string = 'fixie.run', limit: number = 50) => {
    const { data, error } = await supabase
      .from('user_domain_activity')
      .select('*')
      .eq('user_id', userId)
      .eq('domain', domain)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }

    return data || [];
  },

  // Calculate user stats
  calculateUserStats: async (userId: string, domain: string = 'fixie.run') => {
    const activities = await supabaseHelpers.getUserActivities(userId, domain, 1000);

    return activities.reduce((stats, activity) => ({
      totalDistance: stats.totalDistance + (activity.activity_data?.distance || 0),
      totalCalories: stats.totalCalories + (activity.activity_data?.calories || 0),
      totalTokens: stats.totalTokens + (activity.value_eur || 0),
      activitiesCount: stats.activitiesCount + 1,
      lastActivity: activity.created_at > stats.lastActivity ? activity.created_at : stats.lastActivity
    }), {
      totalDistance: 0,
      totalCalories: 0,
      totalTokens: 0,
      activitiesCount: 0,
      lastActivity: '2023-01-01T00:00:00Z'
    });
  },

  // Get leaderboard data
  getLeaderboard: async (domain: string = 'fixie.run', timeframe: 'week' | 'month' | 'year' | 'all' = 'all', limit: number = 50) => {
    let query = supabase
      .from('user_domain_activity')
      .select(`
        user_id,
        value_eur,
        activity_data,
        created_at,
        portfolio_users (
          email,
          wallet_addresses
        )
      `)
      .eq('domain', domain);

    // Apply timeframe filter
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(2020, 0, 1); // Far in the past
    }

    query = query.gte('created_at', startDate.toISOString());

    const { data: activities, error } = await query;

    if (error) {
      console.error('Error fetching leaderboard data:', error);
      return [];
    }

    // Aggregate by user
    const userStats = (activities || []).reduce((acc: any, activity: any) => {
      const userId = activity.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          userId,
          email: activity.portfolio_users?.email || 'Anonymous',
          totalTokens: 0,
          totalDistance: 0,
          totalCalories: 0,
          activitiesCount: 0
        };
      }

      acc[userId].totalTokens += activity.value_eur || 0;
      acc[userId].totalDistance += activity.activity_data?.distance || 0;
      acc[userId].totalCalories += activity.activity_data?.calories || 0;
      acc[userId].activitiesCount += 1;

      return acc;
    }, {});

    // Convert to array and sort
    return Object.values(userStats)
      .sort((a: any, b: any) => b.totalTokens - a.totalTokens)
      .slice(0, limit)
      .map((user: any, index: number) => ({
        ...user,
        rank: index + 1,
        displayName: user.email.split('@')[0] || 'Anonymous'
      }));
  }
};
