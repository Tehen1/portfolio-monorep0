import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share, Users, UserPlus, TrendingUp, MapPin, Calendar, Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SocialProps {
  user: any;
}

interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  activity_data?: any;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_profile?: {
    email: string;
    display_name?: string;
  };
}

interface Friend {
  id: string;
  email: string;
  display_name: string;
  mutual_friends?: number;
  is_friend: boolean;
}

export default function Social({ user }: SocialProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activeTab, setActiveTab] = useState('feed');
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [suggestedFriends, setSuggestedFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadSocialData();
    }
  }, [user]);

  const loadSocialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPosts(),
        loadFriends(),
        loadSuggestedFriends()
      ]);
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('social_posts')
        .select(`
          *,
          portfolio_users (
            email
          )
        `)
        .eq('domain', 'fixie.run')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Transform data to match interface
      const transformedPosts = (postsData || []).map((post: any) => ({
        ...post,
        user_profile: {
          email: post.portfolio_users?.email || 'Anonymous',
          display_name: post.portfolio_users?.email?.split('@')[0] || 'Anonymous'
        }
      }));

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      // Load mock data for demo
      setPosts([
        {
          id: '1',
          user_id: 'user1',
          content: 'Just completed an amazing 25km ride! The weather was perfect today. 🚴‍♂️',
          activity_data: { distance: 25, calories: 450 },
          likes_count: 12,
          comments_count: 3,
          created_at: new Date().toISOString(),
          user_profile: { email: 'alex@example.com', display_name: 'Alex' }
        },
        {
          id: '2',
          user_id: 'user2',
          content: 'New personal best! 180km this week! 💪 Who else is crushing their goals?',
          activity_data: { distance: 180, calories: 3200 },
          likes_count: 24,
          comments_count: 8,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          user_profile: { email: 'sarah@example.com', display_name: 'Sarah' }
        }
      ]);
    }
  };

  const loadFriends = async () => {
    try {
      // Mock friends data - in real app, this would come from a friends table
      setFriends([
        {
          id: 'friend1',
          email: 'mike@example.com',
          display_name: 'Mike',
          mutual_friends: 3,
          is_friend: true
        },
        {
          id: 'friend2',
          email: 'emma@example.com',
          display_name: 'Emma',
          mutual_friends: 5,
          is_friend: true
        }
      ]);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const loadSuggestedFriends = async () => {
    try {
      // Mock suggested friends
      setSuggestedFriends([
        {
          id: 'suggest1',
          email: 'john@example.com',
          display_name: 'John',
          mutual_friends: 2,
          is_friend: false
        },
        {
          id: 'suggest2',
          email: 'lisa@example.com',
          display_name: 'Lisa',
          mutual_friends: 1,
          is_friend: false
        }
      ]);
    } catch (error) {
      console.error('Error loading suggested friends:', error);
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    try {
      const { error } = await supabase
        .from('social_posts')
        .insert({
          user_id: user.id,
          domain: 'fixie.run',
          content: newPost,
          likes_count: 0,
          comments_count: 0
        });

      if (error) throw error;

      setNewPost('');
      loadPosts(); // Reload posts
    } catch (error) {
      console.error('Error creating post:', error);
      // For demo, add to local state
      const mockPost: SocialPost = {
        id: Date.now().toString(),
        user_id: user.id,
        content: newPost,
        likes_count: 0,
        comments_count: 0,
        created_at: new Date().toISOString(),
        user_profile: {
          email: user.email,
          display_name: user.email?.split('@')[0] || 'You'
        }
      };
      setPosts(prev => [mockPost, ...prev]);
      setNewPost('');
    }
  };

  const likePost = async (postId: string) => {
    // In real app, this would update the database
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, likes_count: post.likes_count + 1 }
        : post
    ));
  };

  const addFriend = async (friendId: string) => {
    // In real app, this would send a friend request
    setSuggestedFriends(prev => prev.filter(friend => friend.id !== friendId));
    setFriends(prev => [...prev, {
      id: friendId,
      email: 'newfriend@example.com',
      display_name: 'New Friend',
      is_friend: true
    }]);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">👥 Social Hub</h2>
        <p className="text-gray-600">Connect with fellow cyclists and share your achievements</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'feed', name: 'Feed', icon: '📱' },
              { id: 'friends', name: 'Friends', icon: '👥' },
              { id: 'challenges', name: 'Challenges', icon: '🏆' }
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
          {activeTab === 'feed' && (
            <div className="space-y-6">
              {/* Create Post */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🚴‍♂️</span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share your ride experience..."
                      className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-gray-700">
                          <MapPin className="w-5 h-5" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                          <Calendar className="w-5 h-5" />
                        </button>
                      </div>
                      <button
                        onClick={createPost}
                        disabled={!newPost.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts Feed */}
              <div className="space-y-4">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border p-4"
                  >
                    <div className="flex space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {post.user_profile?.display_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {post.user_profile?.display_name || 'Anonymous'}
                            </h4>
                            <p className="text-sm text-gray-500">{formatTimeAgo(post.created_at)}</p>
                          </div>
                        </div>

                        <p className="mt-2 text-gray-900">{post.content}</p>

                        {post.activity_data && (
                          <div className="mt-3 bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{post.activity_data.distance}km</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400">🔥</span>
                                <span>{post.activity_data.calories} cal</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex space-x-4">
                            <button
                              onClick={() => likePost(post.id)}
                              className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                            >
                              <Heart className="w-5 h-5" />
                              <span>{post.likes_count}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                              <MessageCircle className="w-5 h-5" />
                              <span>{post.comments_count}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
                              <Share className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="space-y-6">
              {/* Current Friends */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Friends ({friends.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friends.map((friend) => (
                    <div key={friend.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {friend.display_name[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{friend.display_name}</h4>
                          <p className="text-sm text-gray-500">{friend.mutual_friends} mutual friends</p>
                        </div>
                        <button className="text-green-600 hover:text-green-700">
                          <Users className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Friends */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Friends</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedFriends.map((friend) => (
                    <div key={friend.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {friend.display_name[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{friend.display_name}</h4>
                          <p className="text-sm text-gray-500">{friend.mutual_friends} mutual friends</p>
                        </div>
                        <button
                          onClick={() => addFriend(friend.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                          <UserPlus className="w-4 h-4 inline mr-1" />
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-4">
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Group Challenges Coming Soon</h3>
                <p className="text-gray-600">
                  Join community challenges, compete with friends, and earn bonus rewards!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
