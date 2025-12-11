import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Activity, Target, Trophy, Users, TrendingUp, Calendar, MapPin, Flame } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DashboardProps {
  user: any;
  stats: any;
}

export default function Dashboard({ user, stats }: DashboardProps) {
  const [activities, setActivities] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    try {
      // Load recent activities
      const { data: recentActivities } = await supabase
        .from('user_domain_activity')
        .select('*')
        .eq('user_id', user.id)
        .eq('domain', 'fixie.run')
        .order('created_at', { ascending: false })
        .limit(10);

      setActivities(recentActivities || []);

      // Load weekly activity data for charts
      const weeklyStats = await generateWeeklyStats(user.id);
      setWeeklyData(weeklyStats);

      // Load active challenges
      const activeChallenges = await loadActiveChallenges();
      setChallenges(activeChallenges);

      // Load leaderboard snippet
      const leaderboardData = await loadLeaderboardSnippet();
      setLeaderboard(leaderboardData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const generateWeeklyStats = async (userId: string) => {
    // Generate mock weekly data (would be calculated from real data)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      day,
      distance: Math.random() * 50 + 10,
      calories: Math.random() * 800 + 200,
      tokens: Math.random() * 25 + 5
    }));
  };

  const loadActiveChallenges = async () => {
    // Mock active challenges
    return [
      {
        id: 1,
        title: "Summer Distance Challenge",
        description: "Ride 500km this summer",
        progress: 245,
        target: 500,
        reward: 100,
        endDate: "2025-08-31"
      },
      {
        id: 2,
        title: "Streak Master",
        description: "Maintain a 30-day riding streak",
        progress: 12,
        target: 30,
        reward: 50,
        endDate: "2025-12-31"
      }
    ];
  };

  const loadLeaderboardSnippet = async () => {
    // Mock leaderboard data
    return [
      { rank: 1, name: "Alex Rider", points: 2847, avatar: "🏆" },
      { rank: 2, name: "Sarah Spin", points: 2654, avatar: "🥈" },
      { rank: 3, name: "Mike Pedal", points: 2532, avatar: "🥉" },
      { rank: 4, name: "You", points: stats.totalTokens || 0, avatar: "👤", isCurrentUser: true }
    ];
  };

  const statCards = [
    {
      title: 'Total Distance',
      value: `${stats.totalDistance?.toFixed(1) || 0} km`,
      icon: MapPin,
      color: 'blue',
      change: '+12.5%'
    },
    {
      title: 'Calories Burned',
      value: `${Math.round(stats.totalCalories || 0)}`,
      icon: Flame,
      color: 'red',
      change: '+8.2%'
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak || 0} days`,
      icon: Calendar,
      color: 'green',
      change: stats.currentStreak > 0 ? 'Active' : 'Start today!'
    },
    {
      title: 'Tokens Earned',
      value: `${stats.totalTokens?.toFixed(2) || 0}`,
      icon: Trophy,
      color: 'purple',
      change: '+15.3%'
    }
  ];

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B'];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user?.email?.split('@')[0] || 'Cyclist'}! 🚴‍♂️
            </h2>
            <p className="text-blue-100">
              Ready to crush today's ride? Your fitness journey awaits.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{stats.level || 1}</div>
            <div className="text-sm text-blue-100">Level</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${
                  stat.change.includes('+') ? 'text-green-600' :
                  stat.change.includes('-') ? 'text-red-600' :
                  'text-gray-500'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="distance" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="calories" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Activity Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Morning Rides', value: 35, color: '#3B82F6' },
                  { name: 'Evening Rides', value: 28, color: '#10B981' },
                  { name: 'Weekend Rides', value: 22, color: '#F59E0B' },
                  { name: 'Group Rides', value: 15, color: '#8B5CF6' }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {[
                  { name: 'Morning Rides', value: 35 },
                  { name: 'Evening Rides', value: 28 },
                  { name: 'Weekend Rides', value: 22 },
                  { name: 'Group Rides', value: 15 }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Challenges</h3>
          <div className="space-y-4">
            {challenges.map((challenge: any) => (
              <div key={challenge.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{challenge.title}</h4>
                  <span className="text-sm text-purple-600 font-medium">
                    {challenge.reward} PTF
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{challenge.progress}/{challenge.target}</span>
                  <span>{Math.round((challenge.progress / challenge.target) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity: any, index: number) => (
              <div key={activity.id || index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.activity_data?.distance?.toFixed(1) || 0}km Ride
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    +{activity.value_eur?.toFixed(2) || 0} PTF
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard Snippet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leaderboard</h3>
          <div className="space-y-2">
            {leaderboard.map((user: any) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                  user.isCurrentUser ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 w-6">#{user.rank}</span>
                  <span className="text-lg">{user.avatar}</span>
                  <span className={`text-sm font-medium ${
                    user.isCurrentUser ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    {user.name}
                  </span>
                </div>
                <span className={`text-sm font-semibold ${
                  user.isCurrentUser ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {user.points} pts
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View Full Leaderboard →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
