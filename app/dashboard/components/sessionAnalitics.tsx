'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, LeaderboardData } from '@/types';
import { ChartBarIcon, ClockIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { fetchSessionStats } from '@/lib/api';

interface SessionStats {
    _id: string;
    userDetails: {
        username: string;
        firstName: string;
        lastName: string;
    };
    sessionCount: number;
    highestScore: number;
    rank?: number;
}

interface SessionAnalyticsProps {
    viewType: string;
    onUserSelect: (user: User) => void;
}

export default function SessionAnalytics({ viewType, onUserSelect }: SessionAnalyticsProps) {

    const [sessionStats, setSessionStats] = useState<SessionStats[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getSessionStats = async () => {
            setLoading(true);
            try {
                const response = await fetchSessionStats();
                const data = response.data;

                // Add ranking to session stats
                const rankedStats = data[`${viewType}Stats`]
                    .sort((a: SessionStats, b: SessionStats) => b.sessionCount - a.sessionCount)
                    .map((stat: SessionStats, index: number) => ({
                        ...stat,
                        rank: index + 1
                    }));

                setSessionStats(rankedStats);
            } catch (error) {
                console.error('Failed to fetch session stats:', error);
            } finally {
                setLoading(false);
            }
        };

        getSessionStats();
    }, [viewType]);
    const handleStatClick = (stat: SessionStats) => {
        const user: User = {
            _id: stat._id,
            telegramId: '',
            username: stat.userDetails.username,
            firstName: stat.userDetails.firstName,
            lastName: stat.userDetails.lastName,
            dailyBestScore: stat.highestScore,
            weeklyBestScore: stat.highestScore,
            bestScore: stat.highestScore,
            updatedAt: new Date().toISOString()
        };
        onUserSelect(user);
    };
    const getRankingColor = (rank: number) => {
        switch (rank) {
            case 1: return 'text-yellow-500';
            case 2: return 'text-gray-400';
            case 3: return 'text-amber-600';
            default: return 'text-gray-500';
        }
    };

    if (loading) {
        return (
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 h-[300px] sm:h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Session Rankings
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {viewType.toUpperCase()}
                </span>
            </div>

            <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[250px] sm:max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {sessionStats.map((stat, index) => (
                    <motion.div
                        key={stat._id}
                        onClick={() => handleStatClick(stat)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                            <div className="flex items-center w-full sm:w-auto">
                                <div className="flex items-center mr-3 w-[40px]"> {/* Fixed width container for rank */}
                                    <span className={`text-lg font-bold ${getRankingColor(stat.rank || 0)} mr-2`}>
                                        {stat.rank}
                                    </span>
                                    {stat.rank && stat.rank <= 3 && (
                                        <TrophyIcon className={`h-5 w-5 ${getRankingColor(stat.rank)}`} />
                                    )}
                                </div>
                                <div className="w-[40px] sm:w-[48px]"> {/* Fixed width container for image */}
                                    <img
                                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${stat.userDetails.username}`}
                                        alt={stat.userDetails.username}
                                    />
                                </div>
                                <div className="ml-3"> {/* Moved margin to text container */}
                                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                                        {stat.userDetails.firstName} {stat.userDetails.lastName}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500">@{stat.userDetails.username}</p>
                                </div>
                            </div>

                            <div className="text-right w-full sm:w-auto">
                                <p className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                                    {stat.sessionCount} sessions
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    Highest Score: {stat.highestScore.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {sessionStats.length === 0 && (
                    <div className="text-center py-6 sm:py-8">
                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">No session data available</p>
                    </div>
                )}
            </div>
        </div>
    );
}
