import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Users, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LeaderboardUser {
  userId: string;
  displayName: string;
  email: string;
  wallet: string;
  totalTokens: number;
  totalDistance: number;
  totalCalories: number;
  activitiesCount: number;
  rank: number;
  isCurrentUser: boolean;
}

interface LeaderboardProps {
  user: any;
}

export default function Leaderboard({ user }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [timeframe, setTimeframe] = useState('all-time');
  const [category, setCategory] = useState('tokens');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe, category]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
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
        .eq('domain', 'fixie.run');

      // Apply timeframe filter
      if (timeframe !== 'all-time') {
        const now = new Date();
        let startDate;

        switch (timeframe) {
          case 'weekly':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'yearly':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(0);
        }

        query = query.gte('created_at', startDate.toISOString());
      }

      const { data: activities, error } = await query;

      if (error) throw error;

      // Aggregate data by user
      const userStats = activities?.reduce((acc: any, activity: any) => {
        const userId = activity.user_id;
        const userInfo = activity.portfolio_users;

        if (!acc[userId]) {
          acc[userId] = {
            userId,
            email: userInfo?.email || 'Anonymous',
            wallet: userInfo?.wallet_addresses?.[0] || '',
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
      }, {}) || {};

      // Convert to array and sort
      const sortedUsers = Object.values(userStats)
        .map((userStat: any) => ({
          ...userStat,
          displayName: userStat.email.split('@')[0] || 'Anonymous',
          rank: 0 // Will be set after sorting
        }))
        .sort((a: any, b: any) => {
          switch (category) {
            case 'tokens':
              return b.totalTokens - a.totalTokens;
            case 'distance':
              return b.totalDistance - a.totalDistance;
            case 'calories':
              return b.totalCalories - a.totalCalories;
            case 'activities':
              return b.activitiesCount - a.activitiesCount;
            default:
              return b.totalTokens - a.totalTokens;
          }
        })
        .slice(0, 50) // Top 50
        .map((userStat: any, index: number) => ({
          ...userStat,
          rank: index + 1,
          isCurrentUser: user?.id === userStat.userId
        }));

      setLeaderboard(sortedUsers);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getValueDisplay = (user: any) => {
    switch (category) {
      case 'tokens':
        return `${user.totalTokens?.toFixed(2) || 0} PTF`;
      case 'distance':
        return `${user.totalDistance?.toFixed(1) || 0} km`;
      case 'calories':
        return `${Math.round(user.totalCalories || 0)} cal`;
      case 'activities':
        return `${user.activitiesCount || 0} rides`;
      default:
        return `${user.totalTokens?.toFixed(2) || 0} PTF`;
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'tokens':
        return 'Tokens Earned';
      case 'distance':
        return 'Distance';
      case 'calories':
        return 'Calories Burned';
      case 'activities':
        return 'Activities';
      default:
        return 'Tokens Earned';
    }
  };

  const timeframeOptions = [
    { value: 'all-time', label: 'All Time' },
    { value: 'yearly', label: 'This Year' },
    { value: 'monthly', label: 'This Month' },
    { value: 'weekly', label: 'This Week' }
  ];

  const categoryOptions = [
    { value: 'tokens', label: 'Tokens', icon: '💰' },
    { value: 'distance', label: 'Distance', icon: '📏' },
    { value: 'calories', label: 'Calories', icon: '🔥' },
    { value: 'activities', label: 'Activities', icon: '🚴‍♂️' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🏆 Leaderboard</h2>
        <p className="text-gray-600">See how you stack up against other cyclists</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeframeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.icon} {option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <Users className="w-4 h-4 inline mr-1" />
            {leaderboard.length} participants
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Top Performers - {getCategoryLabel()}
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {leaderboard.map((user: any, index: number) => (
            <motion.div
              key={user.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                user.isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10">
                    {getRankIcon(user.rank)}
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      user.isCurrentUser ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {user.rank <= 3 ? '👑' : '🚴‍♂️'}
                    </div>

                    <div>
                      <div className={`font-medium ${user.isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                        {user.displayName}
                        {user.isCurrentUser && <span className="text-xs text-blue-600 ml-2">(You)</span>}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.activitiesCount || 0} activities
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-bold ${user.isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                    {getValueDisplay(user)}
                  </div>
                  {category === 'tokens' && user.totalDistance > 0 && (
                    <div className="text-sm text-gray-500">
                      {user.totalDistance.toFixed(1)} km total
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No data available for this timeframe</p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {leaderboard.reduce((sum: number, user: any) => sum + (user.totalDistance || 0), 0).toFixed(0)} km
          </div>
          <div className="text-sm text-gray-600">Total Distance</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {leaderboard.reduce((sum: number, user: any) => sum + (user.totalTokens || 0), 0).toFixed(0)}
          </div>
          <div className="text-sm text-gray-600">Tokens Awarded</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {leaderboard.reduce((sum: number, user: any) => sum + (user.activitiesCount || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Activities Logged</div>
        </div>
      </div>
    </div>
  );
}
