'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, LeaderboardData } from '@/types';
import { fetchDailyData, fetchWeeklyData, fetchTotalData } from '@/lib/api';

interface SessionListProps {
  selectedUser: User | null;
  viewType: string;
}

interface GameSession {
  _id: string;
  user: {
    _id: string | undefined;
  } | undefined;
  score: number;
  startTime: string;
  duration: number;
}


export default function SessionList({ selectedUser, viewType }: SessionListProps) {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!selectedUser) return;

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

        if (response?.data?.sessions) {
          const userSessions = response.data.sessions.filter(
            (session: GameSession) => session.user?._id === selectedUser._id
          );
          setSessions(userSessions);
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [selectedUser, viewType]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-[600px] flex flex-col items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-center">Select a user to view their sessions</p>
      </div>
    );
  }

  const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);
  // const averageScore = sessions.length > 0 ? Math.round(totalScore / sessions.length) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {selectedUser.firstName}'s Sessions
        </h2>
        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
          {viewType.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-4">
          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">
            {viewType.charAt(0).toUpperCase() + viewType.slice(1)} Sum Score
          </p>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
            {totalScore.toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 rounded-xl p-4">
          <p className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-1">
            {viewType.charAt(0).toUpperCase() + viewType.slice(1)} Best Score
          </p>
          <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
            {viewType === 'daily' && selectedUser.dailyBestScore.toLocaleString()}
            {viewType === 'weekly' && selectedUser.weeklyBestScore.toLocaleString()}
            {viewType === 'total' && selectedUser.bestScore.toLocaleString()}
          </p>
        </div>
      </div>


      <div className="space-y-4 overflow-y-auto max-h-[400px]">
        {sessions.map((session, index) => (
          <motion.div
            key={session._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Score: {session.score}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(session.startTime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {/* <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${session.score > averageScore
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                    }`}
                >
                  {session.score > averageScore ? 'Above Average' : 'Below Average'}
                </span> */}
              </div>
            </div>
          </motion.div>
        ))}
        {sessions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No sessions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
