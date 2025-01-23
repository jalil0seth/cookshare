import React from 'react';
import { Copy, Check, Facebook, Share2 } from 'lucide-react';
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

  const renderSEOCard = (text: string) => {
    const metaMatch = text.match(/\[SEO METADATA CARD\]([\s\S]*?)\[CONTENT STRUCTURE/);
    if (metaMatch && content.type === 'seo') {
      const metaContent = metaMatch[1].trim();
      const metaItems = metaContent.split('\n').filter(line => line.trim());
      
      return (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">SEO Metadata</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metaItems.map((line, index) => {
              const [label, value] = line.split(':').map(s => s.trim());
              return (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
                  <div className="text-sm text-gray-900">{value}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderSocialIcons = () => {
    if (content.type === 'recipe' || content.type === 'pinterest') {
      return (
        <div className="flex items-center space-x-3 mt-2">
          <div className="flex items-center space-x-1 text-blue-600">
            <Facebook className="w-4 h-4" />
            <span className="text-xs">Share</span>
          </div>
          <div className="flex items-center space-x-1 text-red-600">
            <Share2 className="w-4 h-4" />
            <span className="text-xs">Pin it</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (content.type === 'article') {
      return (
        <div className="prose max-w-none">
          <div className="article-content" dangerouslySetInnerHTML={{ __html: content.text }} />
        </div>
      );
    }
    return (
      <div className="prose max-w-none">
        <ReactMarkdown>{content.text}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className={`bg-${typeColor}-50 p-4 border-b border-${typeColor}-100`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TypeIcon className={`w-6 h-6 text-${typeColor}-600`} />
            <div>
              <h3 className="font-semibold text-gray-900">{GENERATION_TYPES[content.type].label}</h3>
              {renderSocialIcons()}
            </div>
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
        
        {renderSEOCard(content.text)}
        {renderContent()}
      </div>
    </div>
  );
};