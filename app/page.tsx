'use client';
import { useEffect, useState } from 'react';
import Dashboard from './dashboard/page';
import FrequentUsers from './dashboard/frequentlyUsers';

export default function Home() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    weeklyActiveUsers: 0,
    dailyActiveUsers: 0
  });
  const [averageScore, setAverageScore] = useState(0);
  const [currentView, setCurrentView] = useState('daily');

  const handleViewChange = (viewType: string, avgScore: number) => {
    setCurrentView(viewType);
    setAverageScore(avgScore);
  };
  useEffect(() => {
    const fetchMetrics = async () => {
      try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/userMetrics`, {
          method: 'POST',
        });

        const data = await response.json();

        setMetrics(data.metrics);
      } catch (error) {
        console.log('Error fetching metrics:', error);
      }
    };


    fetchMetrics();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchMetrics, 300000);
    return () => clearInterval(interval);
  }, []);


  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 lg:space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 lg:space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Hamie Game Dashboard
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto">
              Dive into your gaming analytics and performance metrics with our advanced tracking system
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* All time Users */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 lg:p-8 transform hover:scale-105 transition-all duration-300 border border-gray-700/50">
              <h3 className="text-xl lg:text-2xl font-bold text-blue-400 mb-2">All time Users</h3>
              <p className="text-3xl lg:text-4xl font-bold">{metrics.totalUsers.toLocaleString()}</p>
            </div>
            {/* Weekly Users */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 lg:p-8 transform hover:scale-105 transition-all duration-300 border border-gray-700/50">
              <h3 className="text-xl lg:text-2xl font-bold text-purple-400 mb-2">Weekly Users</h3>
              <p className="text-3xl lg:text-4xl font-bold">{metrics.weeklyActiveUsers.toLocaleString()}</p>
            </div>
            {/* Today Users */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 lg:p-8 transform hover:scale-105 transition-all duration-300 border border-gray-700/50">
              <h3 className="text-xl lg:text-2xl font-bold text-pink-400 mb-2">Today Users</h3>
              <p className="text-3xl lg:text-4xl font-bold">{metrics.dailyActiveUsers.toLocaleString()}</p>
            </div>
            {/* Average Score */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 lg:p-8 transform hover:scale-105 transition-all duration-300 border border-gray-700/50">
              <h3 className="text-xl lg:text-2xl font-bold text-green-400 mb-2">
                {currentView.charAt(0).toUpperCase() + currentView.slice(1)} Average
              </h3>
              <p className="text-3xl lg:text-4xl font-bold">{averageScore.toLocaleString()}</p>
            </div>
          </div>

          {/* Dashboard Layout */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="w-full lg:w-1/4">
              <FrequentUsers />
            </div>
            <div className="w-full lg:w-3/4">
              <Dashboard onViewChange={handleViewChange} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
