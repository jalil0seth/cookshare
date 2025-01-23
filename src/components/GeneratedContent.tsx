import React from 'react';
import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GeneratedContent } from '../types';
import { GENERATION_TYPES } from '../constants';

interface GeneratedContentProps {
  content: GeneratedContent;
  progress: number | undefined;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

export const GeneratedContentView: React.FC<GeneratedContentProps> = ({
  content,
  progress,
  copiedId,
  onCopy,
}) => {
  const TypeIcon = GENERATION_TYPES[content.type].Icon;
  const typeColor = GENERATION_TYPES[content.type].color;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className={`bg-${typeColor}-50 p-4 border-b border-${typeColor}-100`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TypeIcon className={`w-6 h-6 text-${typeColor}-600`} />
            <h3 className="font-semibold text-gray-900">{GENERATION_TYPES[content.type].label}</h3>
          </div>
          <button
            onClick={() => onCopy(content.text, content.id)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {copiedId === content.id ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="p-4">
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                progress === -1 
                  ? 'bg-red-500' 
                  : progress === 100 
                    ? 'bg-green-500'
                    : 'bg-blue-500'
              }`}
              style={{ width: `${progress === -1 ? 100 : progress}%` }}
            />
          </div>
        )}
        
        <div className="prose max-w-none">
          <ReactMarkdown>{content.text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};