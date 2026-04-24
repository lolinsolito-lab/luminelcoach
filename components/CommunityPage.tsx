import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'leaderboard'>('feed');

  // Mock posts
  const posts = [
    {
      id: 1,
      user: { name: 'Sarah Chen', avatar: 'S', level: 5 },
      content: 'Just completed my 30-day meditation streak! Feeling amazing and more centered than ever. 🧘‍♀️',
      likes: 24,
      comments: 8,
      timestamp: '2h ago'
    },
    {
      id: 2,
      user: { name: 'Michael Torres', avatar: 'M', level: 8 },
      content: 'Finished "The Art of Mindful Living" quest today. The breathwork techniques have been life-changing!',
      likes: 42,
      comments: 15,
      timestamp: '5h ago'
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">Community</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Connect with fellow transformers
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-200 dark:border-slate-700">
        {(['feed', 'groups', 'leaderboard'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold capitalize transition-all ${activeTab === tab
                ? 'text-luminel-gold-soft dark:text-luminel-gold-soft border-b-2 border-luminel-gold-soft dark:border-luminel-gold-soft'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Feed Tab */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Create Post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700"
          >
            <textarea
              placeholder="Share your journey..."
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-luminel-gold-soft resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-4">
              <button className="px-6 py-2 bg-luminel-gold-soft text-white rounded-xl font-bold hover:bg-luminel-taupe transition-colors">
                Post
              </button>
            </div>
          </motion.div>

          {/* Posts */}
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-luminel-gold-soft to-luminel-gold-soft flex items-center justify-center text-white font-bold text-lg">
                  {post.user.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 dark:text-white">{post.user.name}</h4>
                    <span className="px-2 py-0.5 bg-luminel-champagne dark:bg-indigo-900/30 text-luminel-gold-soft dark:text-luminel-gold-soft text-xs font-bold rounded-full">
                      Lv. {post.user.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{post.timestamp}</p>
                </div>
              </div>

              {/* Content */}
              <p className="text-slate-700 dark:text-slate-300 mb-4">{post.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  <HeartIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-luminel-gold-soft dark:hover:text-luminel-gold-soft transition-colors">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-green-500 dark:hover:text-green-400 transition-colors">
                  <ShareIcon className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Groups Tab */}
      {activeTab === 'groups' && (
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-12 border border-slate-200 dark:border-slate-700 text-center">
          <UserGroupIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Groups feature coming soon</p>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-12 border border-slate-200 dark:border-slate-700 text-center">
          <TrophyIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Leaderboard coming soon</p>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;