import React from 'react';
import { GENERATION_TYPES } from '../constants';

interface ContentTypeSelectorProps {
  selectedTypes: Set<string>;
  onToggleType: (type: string) => void;
}

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  selectedTypes,
  onToggleType,
}) => {
  const getButtonClasses = (type: string, color: string) => {
    const baseClasses = "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200";
    const selectedClasses = {
      blue: "border-blue-500 bg-blue-100 text-blue-700",
      red: "border-red-500 bg-red-100 text-red-700",
      yellow: "border-yellow-500 bg-yellow-100 text-yellow-700",
      green: "border-green-500 bg-green-100 text-green-700"
    };
    const unselectedClasses = "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700";
    
    return `${baseClasses} ${selectedTypes.has(type) ? selectedClasses[color as keyof typeof selectedClasses] : unselectedClasses}`;
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Content Types (Select multiple)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(GENERATION_TYPES).map(([type, { label, Icon, color }]) => (
          <button
            key={type}
            onClick={() => onToggleType(type)}
            className={getButtonClasses(type, color)}
          >
            <Icon 
              className={`w-6 h-6 mb-2 ${
                selectedTypes.has(type) 
                  ? `text-${color}-600` 
                  : 'text-gray-500'
              }`}
            />
            <span className="text-sm font-medium text-center">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};