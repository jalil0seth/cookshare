import React from 'react';
import { Key } from 'lucide-react';

interface SettingsProps {
  apiKey: string;
  showApiKey: boolean;
  customPrompt: string;
  language: string;
  onApiKeyChange: (value: string) => void;
  onToggleShowApiKey: () => void;
  onCustomPromptChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  apiKey,
  showApiKey,
  customPrompt,
  language,
  onApiKeyChange,
  onToggleShowApiKey,
  onCustomPromptChange,
  onLanguageChange,
}) => {
  return (
    <div className="mb-6 border-b pb-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Google Gemini API Key
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-emerald-600 hover:text-emerald-500 text-sm"
          >
            Get your API key here →
          </a>
        </label>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter your API key"
          />
          <button
            onClick={onToggleShowApiKey}
            className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
          >
            <Key className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Prompt Template (Optional)
        </label>
        <textarea
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Enter your custom prompt template or leave empty to use default"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Output Language
        </label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Italian">Italian</option>
        </select>
      </div>
    </div>
  );
};