'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TabNavigation from './components/TabNavigation';
import ScoreTable from './components/ScoreTable';
import SessionList from './components/SessionList';
import { User } from '@/types';
import SessionAnalytics from './components/sessionAnalitics';
import { fetchDailyData, fetchWeeklyData, fetchTotalData } from '@/lib/api';

interface DashboardProps {
    onViewChange: (viewType: string, avgScore: number) => void;
}

export default function DashboardClient({ onViewChange }: DashboardProps) {
    const [selectedView, setSelectedView] = useState('daily');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleTabChange = async (viewType: string) => {
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
            const newAverageScore = response.data.averageScore || 0;
            setSelectedView(viewType);
            onViewChange(viewType, newAverageScore);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 lg:mb-12"
                >
                    <div className="text-center space-y-4 max-w-4xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                                Hamie Game Dashboard
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300">
                            Real-time gaming performance analytics
                        </p>
                    </div>
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 lg:mb-12 sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg"
                >
                    <TabNavigation
                        selectedView={selectedView}
                        onViewChange={setSelectedView}
                        handleTabChange={handleTabChange}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8 lg:mb-12"
                >
                    <SessionAnalytics
                        viewType={selectedView}
                        onUserSelect={setSelectedUser}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8"
                >
                    <div className="xl:col-span-8 2xl:col-span-8">
                        <motion.div
                            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl overflow-hidden"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ScoreTable
                                viewType={selectedView}
                                onUserSelect={setSelectedUser}
                            />
                        </motion.div>
                    </div>

                    <div className="xl:col-span-4 2xl:col-span-4">
                        <motion.div
                            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl overflow-hidden"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                        >
                            <SessionList
                                selectedUser={selectedUser}
                                viewType={selectedView}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 lg:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </motion.button>
        </div>
    );
}
