'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, LeaderboardData } from '@/types';
import { fetchDailyData, fetchWeeklyData, fetchTotalData } from '@/lib/api';
import { TrophyIcon, ArrowUpIcon } from '@heroicons/react/24/solid';

interface ScoreTableProps {
  viewType: string;
  onUserSelect: (user: User) => void;
}

export default function ScoreTable({ viewType, onUserSelect }: ScoreTableProps) {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        switch (viewType) {
          case 'daily':
            response = await fetchDailyData();
            break;
          case 'weekly':
            response = await fetchWeeklyData();
            break;
          case 'total':
            response = await fetchTotalData();
            break;
          default:
            return;
        }
        
        if (response && response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewType]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {viewType.charAt(0).toUpperCase() + viewType.slice(1)} Leaderboard
        </h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
          {data?.userlist?.length || 0} Active Players
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Player</th>
              <th className="px-4 py-2 text-right">Score</th>
              <th className="px-4 py-2 text-right">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {data?.userlist?.map((user, index) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onUserSelect(user)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    {index < 3 ? (
                      <TrophyIcon 
                        className={`h-5 w-5 mr-2 ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-gray-400' :
                          'text-amber-600'
                        }`}
                      />
                    ) : null}
                    #{index + 1}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full mr-3" src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`} alt={user.username} />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</div>
                      <div className="text-gray-500 dark:text-gray-400">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end">
                    <span className="font-bold text-gray-900 dark:text-white mr-2">
                      {viewType === 'daily' ? user.dailyBestScore.toLocaleString() :
                       viewType === 'weekly' ? user.weeklyBestScore.toLocaleString() :
                       user.bestScore.toLocaleString()}
                    </span>
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">
                  {new Date(user.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

