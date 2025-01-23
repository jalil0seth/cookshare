import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeneratedContent, GenerationProgress, GroupedContent } from './types';
import { GENERATION_TYPES } from './constants';
import { Header } from './components/Header';
import { Settings } from './components/Settings';
import { ContentTypeSelector } from './components/ContentTypeSelector';
import { ContentHistory } from './components/ContentHistory';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [keywords, setKeywords] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['recipe']));
  const [customPrompt, setCustomPrompt] = useState('');
  const [language, setLanguage] = useState('English');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [progress, setProgress] = useState<GenerationProgress>({});
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) setApiKey(savedApiKey);
    
    const savedHistory = localStorage.getItem('generationHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleCopy = async (text: string, id: string) => {
    try {
      const plainText = text.replace(/[#*`-]/g, '').trim();
      await navigator.clipboard.writeText(plainText);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const toggleContentType = (type: string) => {
    const newTypes = new Set(selectedTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    if (newTypes.size === 0) {
      newTypes.add('recipe');
    }
    setSelectedTypes(newTypes);
  };

  const generateContent = async (keyword: string, type: string) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = customPrompt || (
      typeof GENERATION_TYPES[type].defaultPrompt === 'function'
        ? GENERATION_TYPES[type].defaultPrompt(language, keyword)
        : GENERATION_TYPES[type].defaultPrompt + ' ' + keyword
    );
    
    const fullPrompt = type !== 'recipe' ? `${prompt}\n\nGenerate in ${language} language.` : prompt;

    setProgress(prev => ({
      ...prev,
      [`${keyword}-${type}`]: 0
    }));

    const progressInterval = setInterval(() => {
      setProgress(prev => ({
        ...prev,
        [`${keyword}-${type}`]: Math.min((prev[`${keyword}-${type}`] || 0) + 10, 90)
      }));
    }, 500);

    try {
      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();

      clearInterval(progressInterval);
      setProgress(prev => ({
        ...prev,
        [`${keyword}-${type}`]: 100
      }));

      return {
        id: `${Date.now()}-${type}`,
        type,
        name: keyword.trim(),
        text,
        timestamp: Date.now(),
        progress: 100
      };
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(prev => ({
        ...prev,
        [`${keyword}-${type}`]: -1
      }));
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Please enter your Gemini API key');
      return;
    }
    if (!keywords) {
      setError('Please enter keywords to generate content');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const keywordList = keywords.split('\n').filter(k => k.trim());
      const newContent: GeneratedContent[] = [];
      
      for (const keyword of keywordList) {
        for (const type of selectedTypes) {
          const content = await generateContent(keyword, type);
          newContent.push(content);
        }
      }
      
      setHistory(prev => [...newContent, ...prev]);
      setLoading(false);
      setKeywords('');
      localStorage.setItem('generationHistory', JSON.stringify([...newContent, ...history]));
      
      const newGroups = new Set(expandedGroups);
      keywordList.forEach(keyword => newGroups.add(keyword));
      setExpandedGroups(newGroups);
    } catch (err) {
      setError('Failed to generate content. Please check your API key and try again.');
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('generationHistory');
  };

  const toggleGroup = (keyword: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(keyword)) {
      newExpanded.delete(keyword);
    } else {
      newExpanded.add(keyword);
    }
    setExpandedGroups(newExpanded);
  };

  const groupContentByKeyword = (content: GeneratedContent[]): GroupedContent => {
    return content.reduce((groups: GroupedContent, item) => {
      if (!groups[item.name]) {
        groups[item.name] = [];
      }
      groups[item.name].push(item);
      return groups;
    }, {});
  };

  const groupedContent = groupContentByKeyword(history);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onToggleSettings={() => setShowSettings(!showSettings)} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {showSettings && (
            <Settings
              apiKey={apiKey}
              showApiKey={showApiKey}
              customPrompt={customPrompt}
              language={language}
              onApiKeyChange={(value) => {
                setApiKey(value);
                localStorage.setItem('geminiApiKey', value);
              }}
              onToggleShowApiKey={() => setShowApiKey(!showApiKey)}
              onCustomPromptChange={setCustomPrompt}
              onLanguageChange={setLanguage}
            />
          )}

          <ContentTypeSelector
            selectedTypes={selectedTypes}
            onToggleType={toggleContentType}
          />

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Keywords (one per line)
            </label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your keywords here, one per line..."
              rows={5}
            />
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <span>Generate Content</span>
            )}
          </button>
        </div>

        {Object.keys(groupedContent).length > 0 && (
          <ContentHistory
            groupedContent={groupedContent}
            expandedGroups={expandedGroups}
            progress={progress}
            copiedId={copiedId}
            onCopy={handleCopy}
            onClearHistory={clearHistory}
            onToggleGroup={toggleGroup}
          />
        )}
      </main>
    </div>
  );
}

export default App;