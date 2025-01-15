'use client';

import { motion } from 'framer-motion';
import { ChartBarIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface TabNavigationProps {
  selectedView: string;
  onViewChange: (value: string) => void;
}

export default function TabNavigation({ selectedView, onViewChange }: TabNavigationProps) {
  const tabs = [
    { id: 'daily', label: 'Daily Stats', icon: ClockIcon },
    { id: 'weekly', label: 'Weekly Overview', icon: CalendarIcon },
    { id: 'total', label: 'All Time Analytics', icon: ChartBarIcon },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2">
      <nav className="flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`flex-1 relative px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
              selectedView === tab.id
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {selectedView === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative flex items-center justify-center space-x-2">
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

