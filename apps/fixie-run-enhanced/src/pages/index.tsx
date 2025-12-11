import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { supabase } from '@/lib/supabase';
import { PortfolioToken } from '@/lib/contracts/PortfolioToken';
import Dashboard from '@/components/Dashboard';
import Onboarding from '@/components/Onboarding';
import Leaderboard from '@/components/Leaderboard';
import Rewards from '@/components/Rewards';
import Social from '@/components/Social';
import Shop from '@/components/Shop';
import Profile from '@/components/Profile';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [userStats, setUserStats] = useState({
    totalDistance: 0,
    totalCalories: 0,
    totalTokens: 0,
    currentStreak: 0,
    level: 1,
    xp: 0
  });

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    checkUserStatus();
  }, [address]);

  const checkUserStatus = async () => {
    if (!address) return;

    try {
      // Check if user exists in database
      const { data: existingUser } = await supabase
        .from('portfolio_users')
        .select('*')
        .eq('wallet_addresses', address)
        .single();

      if (!existingUser) {
        setIsOnboarding(true);
      } else {
        setUser(existingUser);
        await loadUserStats(existingUser.id);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

  const loadUserStats = async (userId: string) => {
    try {
      // Load user activity data
      const { data: activities } = await supabase
        .from('user_domain_activity')
        .select('*')
        .eq('user_id', userId)
        .eq('domain', 'fixie.run')
        .order('created_at', { ascending: false });

      // Calculate stats
      const stats = activities?.reduce((acc, activity) => ({
        totalDistance: acc.totalDistance + (activity.activity_data?.distance || 0),
        totalCalories: acc.totalCalories + (activity.activity_data?.calories || 0),
        totalTokens: acc.totalTokens + (activity.value_eur || 0),
        currentStreak: calculateStreak(activities || []),
        level: Math.floor(acc.xp / 1000) + 1,
        xp: acc.xp + (activity.activity_data?.xp || 0)
      }), {
        totalDistance: 0,
        totalCalories: 0,
        totalTokens: 0,
        currentStreak: 0,
        level: 1,
        xp: 0
      }) || userStats;

      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const calculateStreak = (activities: any[]) => {
    // Calculate current activity streak
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);

      const hasActivity = activities.some(activity => {
        const activityDate = new Date(activity.created_at);
        return activityDate.toDateString() === checkDate.toDateString();
      });

      if (hasActivity) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const completeOnboarding = async (userData: any) => {
    try {
      // Create user in database
      const { data: newUser, error } = await supabase
        .from('portfolio_users')
        .insert({
          email: userData.email,
          wallet_addresses: [address],
          primary_domain: 'fixie.run',
          domains_engaged: ['fixie.run'],
          country_code: userData.country,
          preferred_language: userData.language
        })
        .select()
        .single();

      if (error) throw error;

      setUser(newUser);
      setIsOnboarding(false);
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'leaderboard', name: 'Leaderboard', icon: '🏆' },
    { id: 'rewards', name: 'Rewards', icon: '🎁' },
    { id: 'shop', name: 'Shop', icon: '🛒' },
    { id: 'profile', name: 'Profile', icon: '👤' }
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-white mb-8">
            FIXIE.RUN
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl">
            The future of fitness. Track, compete, and earn tokens through Web3-powered cycling adventures.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConnect}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Connect Wallet to Start
          </motion.button>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-4">🚴‍♂️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Track Activities</h3>
              <p className="text-gray-300">Advanced metabolic tracking with real-time metrics</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-2">Compete & Earn</h3>
              <p className="text-gray-300">Token rewards for achievements and community challenges</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-white mb-2">Web3 Native</h3>
              <p className="text-gray-300">Decentralized ownership of your fitness data and rewards</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isOnboarding) {
    return <Onboarding onComplete={completeOnboarding} walletAddress={address} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">FIXIE.RUN</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Level {userStats.level}</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    style={{ width: `${(userStats.xp % 1000) / 10}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{userStats.xp % 1000}/1000 XP</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Tokens Earned</div>
                <div className="font-semibold text-gray-900">{userStats.totalTokens.toFixed(2)} PTF</div>
              </div>
              <button
                onClick={handleDisconnect}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard user={user} stats={userStats} />
        )}
        {activeTab === 'social' && (
          <Social user={user} />
        )}
        {activeTab === 'leaderboard' && (
          <Leaderboard user={user} />
        )}
        {activeTab === 'rewards' && (
          <Rewards user={user} stats={userStats} />
        )}
        {activeTab === 'shop' && (
          <Shop user={user} />
        )}
        {activeTab === 'profile' && (
          <Profile user={user} stats={userStats} />
        )}
      </main>
    </div>
  );
}
