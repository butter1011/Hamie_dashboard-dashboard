'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TabNavigation from './components/TabNavigation';
import ScoreTable from './components/ScoreTable';
import SessionList from './components/SessionList';
import { User } from '@/types';

export default function Dashboard() {
  const [selectedView, setSelectedView] = useState('daily');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center items-start">
      <div className="container max-w-7xl mx-auto px-4 py-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Hamie Game Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Real-time gaming performance analytics
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <TabNavigation 
            selectedView={selectedView}
            onViewChange={setSelectedView}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ScoreTable 
              viewType={selectedView}
              onUserSelect={setSelectedUser}
            />
          </div>
          <div>
            <SessionList 
              selectedUser={selectedUser}
              viewType={selectedView}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

