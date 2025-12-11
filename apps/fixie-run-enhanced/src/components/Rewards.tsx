import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Trophy, Star, Zap, Target, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RewardsProps {
  user: any;
  stats: any;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'achievement' | 'milestone' | 'challenge' | 'bonus';
  requirement: number;
  current: number;
  reward: number;
  claimed: boolean;
  claimable: boolean;
  category: string;
}

export default function Rewards({ user, stats }: RewardsProps) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [activeTab, setActiveTab] = useState('achievements');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, [user, stats]);

  const loadRewards = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Load user's claimed rewards
      const { data: claimedRewards } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id);

      const claimedRewardIds = claimedRewards?.map(r => r.reward_id) || [];

      // Define available rewards
      const availableRewards: Reward[] = [
        // Distance Achievements
        {
          id: 'first_ride',
          title: 'First Ride',
          description: 'Complete your first cycling activity',
          icon: '🚴‍♂️',
          type: 'achievement',
          requirement: 1,
          current: stats.totalDistance > 0 ? 1 : 0,
          reward: 10,
          claimed: claimedRewardIds.includes('first_ride'),
          claimable: stats.totalDistance > 0 && !claimedRewardIds.includes('first_ride'),
          category: 'distance'
        },
        {
          id: 'distance_10km',
          title: '10km Explorer',
          description: 'Ride a total of 10 kilometers',
          icon: '🗺️',
          type: 'milestone',
          requirement: 10,
          current: stats.totalDistance || 0,
          reward: 25,
          claimed: claimedRewardIds.includes('distance_10km'),
          claimable: (stats.totalDistance || 0) >= 10 && !claimedRewardIds.includes('distance_10km'),
          category: 'distance'
        },
        {
          id: 'distance_100km',
          title: 'Century Rider',
          description: 'Ride a total of 100 kilometers',
          icon: '🏁',
          type: 'milestone',
          requirement: 100,
          current: stats.totalDistance || 0,
          reward: 100,
          claimed: claimedRewardIds.includes('distance_100km'),
          claimable: (stats.totalDistance || 0) >= 100 && !claimedRewardIds.includes('distance_100km'),
          category: 'distance'
        },
        {
          id: 'distance_500km',
          title: 'Half Marathon',
          description: 'Ride a total of 500 kilometers',
          icon: '🏃‍♂️',
          type: 'milestone',
          requirement: 500,
          current: stats.totalDistance || 0,
          reward: 250,
          claimed: claimedRewardIds.includes('distance_500km'),
          claimable: (stats.totalDistance || 0) >= 500 && !claimedRewardIds.includes('distance_500km'),
          category: 'distance'
        },

        // Streak Achievements
        {
          id: 'streak_7',
          title: 'Week Warrior',
          description: 'Maintain a 7-day riding streak',
          icon: '🔥',
          type: 'achievement',
          requirement: 7,
          current: stats.currentStreak || 0,
          reward: 50,
          claimed: claimedRewardIds.includes('streak_7'),
          claimable: (stats.currentStreak || 0) >= 7 && !claimedRewardIds.includes('streak_7'),
          category: 'streak'
        },
        {
          id: 'streak_30',
          title: 'Monthly Master',
          description: 'Maintain a 30-day riding streak',
          icon: '👑',
          type: 'achievement',
          requirement: 30,
          current: stats.currentStreak || 0,
          reward: 150,
          claimed: claimedRewardIds.includes('streak_30'),
          claimable: (stats.currentStreak || 0) >= 30 && !claimedRewardIds.includes('streak_30'),
          category: 'streak'
        },

        // Token Achievements
        {
          id: 'tokens_100',
          title: 'Token Collector',
          description: 'Earn 100 Portfolio Tokens',
          icon: '💰',
          type: 'milestone',
          requirement: 100,
          current: stats.totalTokens || 0,
          reward: 25,
          claimed: claimedRewardIds.includes('tokens_100'),
          claimable: (stats.totalTokens || 0) >= 100 && !claimedRewardIds.includes('tokens_100'),
          category: 'tokens'
        },
        {
          id: 'tokens_500',
          title: 'Token Tycoon',
          description: 'Earn 500 Portfolio Tokens',
          icon: '💎',
          type: 'milestone',
          requirement: 500,
          current: stats.totalTokens || 0,
          reward: 75,
          claimed: claimedRewardIds.includes('tokens_500'),
          claimable: (stats.totalTokens || 0) >= 500 && !claimedRewardIds.includes('tokens_500'),
          category: 'tokens'
        },

        // Level Achievements
        {
          id: 'level_5',
          title: 'Level Up!',
          description: 'Reach level 5',
          icon: '⬆️',
          type: 'milestone',
          requirement: 5,
          current: stats.level || 1,
          reward: 30,
          claimed: claimedRewardIds.includes('level_5'),
          claimable: (stats.level || 1) >= 5 && !claimedRewardIds.includes('level_5'),
          category: 'level'
        },
        {
          id: 'level_10',
          title: 'Elite Rider',
          description: 'Reach level 10',
          icon: '⭐',
          type: 'milestone',
          requirement: 10,
          current: stats.level || 1,
          reward: 100,
          claimed: claimedRewardIds.includes('level_10'),
          claimable: (stats.level || 1) >= 10 && !claimedRewardIds.includes('level_10'),
          category: 'level'
        }
      ];

      setRewards(availableRewards);
    } catch (error) {
      console.error('Error loading rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (rewardId: string) => {
    try {
      const reward = rewards.find(r => r.id === rewardId);
      if (!reward || !reward.claimable) return;

      // Insert reward claim
      const { error } = await supabase
        .from('user_rewards')
        .insert({
          user_id: user.id,
          reward_id: rewardId,
          reward_amount: reward.reward,
          claimed_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local state
      setRewards(prev => prev.map(r =>
        r.id === rewardId
          ? { ...r, claimed: true, claimable: false }
          : r
      ));

      // You would also update the user's token balance here
      // For now, we'll just show a success message
      alert(`🎉 Reward claimed! You earned ${reward.reward} PTF tokens!`);

    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('Failed to claim reward. Please try again.');
    }
  };

  const getRewardsByCategory = (category: string) => {
    return rewards.filter(reward => reward.category === category);
  };

  const getCategoryStats = (category: string) => {
    const categoryRewards = getRewardsByCategory(category);
    const claimed = categoryRewards.filter(r => r.claimed).length;
    const total = categoryRewards.length;
    return { claimed, total, percentage: total > 0 ? Math.round((claimed / total) * 100) : 0 };
  };

  const categories = [
    { id: 'distance', name: 'Distance', icon: '📏', color: 'blue' },
    { id: 'streak', name: 'Streaks', icon: '🔥', color: 'red' },
    { id: 'tokens', name: 'Tokens', icon: '💰', color: 'green' },
    { id: 'level', name: 'Levels', icon: '⭐', color: 'purple' }
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🎁 Rewards & Achievements</h2>
        <p className="text-gray-600">Earn tokens by reaching milestones and completing challenges</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((category) => {
          const stats = getCategoryStats(category.id);
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-${category.color}-100`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.claimed}/{stats.total}</div>
                  <div className="text-sm text-gray-500">completed</div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-${category.color}-600 h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${stats.percentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 mt-1">{stats.percentage}% complete</div>
            </motion.div>
          );
        })}
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === category.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getRewardsByCategory(activeTab).map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-gray-50 rounded-lg p-6 border-2 transition-all ${
                  reward.claimed
                    ? 'border-green-200 bg-green-50'
                    : reward.claimable
                    ? 'border-yellow-200 bg-yellow-50 hover:border-yellow-300'
                    : 'border-gray-200'
                }`}
              >
                {reward.claimed && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{reward.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{reward.title}</h3>
                  <p className="text-sm text-gray-600">{reward.description}</p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{reward.current}/{reward.requirement}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        reward.claimed
                          ? 'bg-green-500'
                          : reward.claimable
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min((reward.current / reward.requirement) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-gray-900">{reward.reward} PTF</span>
                  </div>

                  {reward.claimed ? (
                    <span className="text-sm text-green-600 font-medium">Claimed</span>
                  ) : reward.claimable ? (
                    <button
                      onClick={() => claimReward(reward.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Claim
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500">Locked</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {getRewardsByCategory(activeTab).length === 0 && (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No rewards available in this category yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Total Rewards Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Your Reward Summary</h3>
            <p className="text-blue-100">
              Keep riding to unlock more achievements and earn tokens!
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {rewards.filter(r => r.claimed).length}/{rewards.length}
            </div>
            <div className="text-sm text-blue-100">Achievements Unlocked</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{rewards.filter(r => r.claimed).reduce((sum, r) => sum + r.reward, 0)}</div>
            <div className="text-sm text-blue-100">Tokens Earned</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{rewards.filter(r => r.claimable).length}</div>
            <div className="text-sm text-blue-100">Available to Claim</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{Math.round((rewards.filter(r => r.claimed).length / rewards.length) * 100)}%</div>
            <div className="text-sm text-blue-100">Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
