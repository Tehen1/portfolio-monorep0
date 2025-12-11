import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Trophy, Target, Calendar, MapPin, Activity, Edit3, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ProfileProps {
  user: any;
  stats: any;
}

export default function Profile({ user, stats }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    location: '',
    fitnessLevel: 'intermediate',
    preferredActivities: [] as string[],
    goals: [] as string[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      // Load user profile data
      const profile = await supabase.helpers.getUserProfile(user.id);

      if (profile) {
        setProfileData({
          displayName: profile.email?.split('@')[0] || '',
          bio: profile.bio || '',
          location: profile.location || '',
          fitnessLevel: profile.fitness_level || 'intermediate',
          preferredActivities: profile.preferred_activities || [],
          goals: profile.goals || []
        });
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const { error } = await supabase
        .from('portfolio_users')
        .update({
          bio: profileData.bio,
          location: profileData.location,
          fitness_level: profileData.fitnessLevel,
          preferred_activities: profileData.preferredActivities,
          goals: profileData.goals,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const achievements = [
    {
      id: 'first_ride',
      title: 'First Ride',
      description: 'Completed your first cycling activity',
      icon: '🚴‍♂️',
      unlocked: stats.totalDistance > 0,
      unlockedDate: '2024-01-15'
    },
    {
      id: 'distance_100',
      title: 'Century Rider',
      description: 'Rode over 100 kilometers total',
      icon: '🏁',
      unlocked: stats.totalDistance >= 100,
      unlockedDate: '2024-02-20'
    },
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: 'Maintained a 7-day riding streak',
      icon: '🔥',
      unlocked: stats.currentStreak >= 7,
      unlockedDate: '2024-03-10'
    },
    {
      id: 'tokens_500',
      title: 'Token Tycoon',
      description: 'Earned 500 Portfolio Tokens',
      icon: '💎',
      unlocked: stats.totalTokens >= 500,
      unlockedDate: '2024-03-25'
    }
  ];

  const recentActivities = [
    { id: '1', type: 'ride', title: 'Morning Ride', distance: 25.5, duration: '1h 15m', date: '2024-12-09' },
    { id: '2', type: 'achievement', title: 'Century Rider Unlocked', date: '2024-12-08' },
    { id: '3', type: 'ride', title: 'Evening Commute', distance: 12.3, duration: '45m', date: '2024-12-07' },
    { id: '4', type: 'social', title: 'Joined Community Challenge', date: '2024-12-06' }
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">👤 Profile</h2>
        <p className="text-gray-600">Manage your cycling profile and achievements</p>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl">
            🚴‍♂️
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{profileData.displayName || 'Cyclist'}</h3>
                <p className="text-blue-100">{user?.email}</p>
                <p className="text-sm text-blue-100 mt-1">
                  Level {stats.level || 1} • {stats.currentStreak || 0} day streak
                </p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalDistance?.toFixed(1) || 0} km</div>
            <div className="text-sm text-blue-100">Total Distance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round(stats.totalCalories || 0)}</div>
            <div className="text-sm text-blue-100">Calories Burned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalTokens?.toFixed(2) || 0}</div>
            <div className="text-sm text-blue-100">Tokens Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{achievements.filter(a => a.unlocked).length}</div>
            <div className="text-sm text-blue-100">Achievements</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'overview', name: 'Overview', icon: '👤' },
              { id: 'achievements', name: 'Achievements', icon: '🏆' },
              { id: 'activity', name: 'Activity', icon: '📊' },
              { id: 'settings', name: 'Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-1 border-b-2 font-medium text-sm text-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Edit Profile Form */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={saveProfile}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                      <input
                        type="text"
                        value={profileData.displayName}
                        onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="City, Country"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Tell us about your cycling journey..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Level</label>
                      <select
                        value={profileData.fitnessLevel}
                        onChange={(e) => setProfileData({ ...profileData, fitnessLevel: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Profile Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{profileData.displayName || 'Not set'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{profileData.location || 'Not set'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600 capitalize">{profileData.fitnessLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bio</h3>
                  <p className="text-gray-600">
                    {profileData.bio || 'No bio added yet. Tell others about your cycling journey!'}
                  </p>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.filter(a => a.unlocked).slice(0, 4).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-6 rounded-lg border-2 transition-all ${
                      achievement.unlocked
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    {achievement.unlocked && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                    )}

                    <div className="text-center">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className={`font-semibold mb-2 ${
                        achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm mb-3 ${
                        achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>

                      {achievement.unlocked && (
                        <div className="text-xs text-yellow-600 font-medium">
                          Unlocked {achievement.unlockedDate}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {achievements.filter(a => !a.unlocked).length > 0 && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <Target className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-900">Keep Going!</h3>
                      <p className="text-blue-700">
                        You have {achievements.filter(a => !a.unlocked).length} more achievements to unlock.
                        Check back regularly to see your progress!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>

              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'ride' ? 'bg-blue-100' :
                      activity.type === 'achievement' ? 'bg-yellow-100' :
                      activity.type === 'social' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {activity.type === 'ride' && <Activity className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'achievement' && <Trophy className="w-5 h-5 text-yellow-600" />}
                      {activity.type === 'social' && <User className="w-5 h-5 text-green-600" />}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      {activity.distance && (
                        <p className="text-sm text-gray-600">
                          {activity.distance}km • {activity.duration}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Load More Activity →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Settings className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h3 className="font-medium text-yellow-900">Settings Coming Soon</h3>
                    <p className="text-yellow-700 text-sm">
                      Account settings, privacy controls, and notification preferences will be available here.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Account</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email</span>
                      <span className="text-gray-900">{user?.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Wallet</span>
                      <span className="text-gray-900 font-mono text-sm">
                        {user?.wallet_addresses?.[0]?.slice(0, 6)}...{user?.wallet_addresses?.[0]?.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Privacy</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Profile Visibility</span>
                      <span className="text-green-600">Public</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Activity Sharing</span>
                      <span className="text-green-600">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
