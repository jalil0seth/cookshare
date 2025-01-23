import React from 'react';
import { ChefHat, Settings } from 'lucide-react';

interface HeaderProps {
  onToggleSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSettings }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ChefHat className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Content Generator</h1>
            <p className="text-sm text-gray-500">Generate optimized content for multiple platforms</p>
          </div>
        </div>
        <button
          onClick={onToggleSettings}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};