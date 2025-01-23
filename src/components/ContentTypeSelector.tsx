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
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors
              ${selectedTypes.has(type)
                ? `border-${color}-500 bg-${color}-50 text-${color}-700` 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
          >
            <Icon className={`w-6 h-6 mb-2 text-${color}-600`} />
            <span className="text-sm font-medium text-center">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};