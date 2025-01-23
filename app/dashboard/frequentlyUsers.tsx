'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchFrequentUsers } from '@/lib/api';
import { Clock, Trophy, Medal } from 'lucide-react';

interface FrequentUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  totalScore: number;
}

const formatPlayTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600*3);
  const minutes = Math.floor(((seconds*3) % 3600) / 60);
  const remainingSeconds = (seconds*3) % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};

const getMedalColor = (index: number) => {
  switch (index) {
    case 0: return 'text-yellow-400';
    case 1: return 'text-gray-400';
    case 2: return 'text-amber-600';
    default: return 'text-blue-400';
  }
};

export default function FrequentUsers() {
  const [frequentUsers, setFrequentUsers] = useState<FrequentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchFrequentUsers();
        if (response?.data?.frequentUsers) {
          setFrequentUsers(response.data.frequentUsers);
        }
      } catch (error) {
        console.error('Failed to fetch frequent users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-6 h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Engagement Insights
        </h2>
      </div>

      <div className="space-y-4">
        {frequentUsers.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="bg-gray-700/50 backdrop-blur-lg rounded-xl p-4 hover:bg-gray-700/70 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`${getMedalColor(index)} flex items-center justify-center w-8 h-8`}>
                    {index < 3 ? <Medal className="w-6 h-6" /> : (index + 1)}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-400">
                      @{user.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-blue-900/50 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">
                    {formatPlayTime(user.totalScore)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
