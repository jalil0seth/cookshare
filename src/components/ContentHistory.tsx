import React from 'react';
import { History, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { GeneratedContent, GroupedContent } from '../types';
import { GeneratedContentView } from './GeneratedContent';

interface ContentHistoryProps {
  groupedContent: GroupedContent;
  expandedGroups: Set<string>;
  progress: Record<string, number>;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  onClearHistory: () => void;
  onToggleGroup: (keyword: string) => void;
}

export const ContentHistory: React.FC<ContentHistoryProps> = ({
  groupedContent,
  expandedGroups,
  progress,
  copiedId,
  onCopy,
  onClearHistory,
  onToggleGroup,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900">Generated Content</h2>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedContent).map(([keyword, contents]) => (
          <div key={keyword} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => onToggleGroup(keyword)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
            >
              <h3 className="text-lg font-medium text-gray-900">{keyword}</h3>
              {expandedGroups.has(keyword) ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedGroups.has(keyword) && (
              <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  {contents
                    .filter(content => ['recipe', 'pinterest'].includes(content.type))
                    .map(content => (
                      <GeneratedContentView
                        key={content.id}
                        content={content}
                        progress={progress[`${content.name}-${content.type}`]}
                        copiedId={copiedId}
                        onCopy={onCopy}
                      />
                    ))}
                </div>
                <div className="space-y-4">
                  {contents
                    .filter(content => ['image', 'seo', 'article'].includes(content.type))
                    .map(content => (
                      <GeneratedContentView
                        key={content.id}
                        content={content}
                        progress={progress[`${content.name}-${content.type}`]}
                        copiedId={copiedId}
                        onCopy={onCopy}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};