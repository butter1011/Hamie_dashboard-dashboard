'use client';
import { useEffect, useState } from 'react';
import Dashboard from './dashboard/page';

export default function Home() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    weeklyActiveUsers: 0,
    dailyActiveUsers: 0
  });

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
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Hero Section */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-center">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Welcome to Hamie Game Dashboard
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto">
            Dive into your gaming analytics and performance metrics with our advanced tracking system
          </p>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 hover:transform hover:scale-105 transition-all">
              <h3 className="text-xl font-bold text-blue-400">Total Users</h3>
              <p className="text-3xl font-bold mt-2">{metrics.totalUsers}</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 hover:transform hover:scale-105 transition-all">
              <h3 className="text-xl font-bold text-purple-400">Weekly Users</h3>
              <p className="text-3xl font-bold mt-2">{metrics.weeklyActiveUsers}</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 hover:transform hover:scale-105 transition-all">
              <h3 className="text-xl font-bold text-pink-400">Today Users</h3>
              <p className="text-3xl font-bold mt-2">{metrics.dailyActiveUsers}</p>
            </div>
          </div>

          <div><Dashboard /></div>
        </div>
      </div>
    </main>
  );
}
