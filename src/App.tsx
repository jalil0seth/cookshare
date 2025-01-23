import React, { useState, useEffect } from 'react';
import { ChefHat, History, Trash2, Key, Image, FileText, ListChecks, Settings, Copy, Check, Facebook, Share2, Loader } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeneratedContent {
  id: string;
  type: 'recipe' | 'image' | 'seo' | 'article';
  name: string;
  text: string;
  imageUrl?: string;
  imagePrompt?: string;
  seoKeywords?: string[];
  timestamp: number;
  progress?: number;
}

interface GenerationProgress {
  [key: string]: number;
}

const GENERATION_TYPES = {
  recipe: {
    label: 'Facebook Recipe Post',
    Icon: Facebook,
    color: 'blue',
    defaultPrompt: `Create a recipe post in this format:
Recipe Name
Description
Ingredients
Instructions (numbered)
Tips and Notes

Make it for:`
  },
  pinterest: {
    label: 'Pinterest Recipe',
    Icon: Share2,
    color: 'red',
    defaultPrompt: `Create a Pinterest-optimized recipe with:
- Catchy title
- Brief description
- Key ingredients
- Quick instructions
- Relevant hashtags

Recipe for:`
  },
  image: {
    label: 'Midjourney Prompt',
    Icon: Image,
    color: 'purple',
    defaultPrompt: `Create a detailed Midjourney prompt only, no additional text.
Include:
- Subject description
- Style/mood
- Lighting
- Camera angle
- Technical specs

For:`
  },
  seo: {
    label: 'WordPress SEO',
    Icon: ListChecks,
    color: 'green',
    defaultPrompt: `Create WordPress SEO elements:
- Meta title (60 chars max)
- Meta description (160 chars max)
- Focus keywords (5-7)
- Secondary keywords (8-10)
- SEO title
- Slug

For:`
  },
  article: {
    label: 'Blog Article',
    Icon: FileText,
    color: 'indigo',
    defaultPrompt: `Write a complete blog post with:
- SEO-optimized title
- Introduction
- Main sections
- Conclusion
- Meta description
- Keywords

Topic:`
  }
};

function App() {
  const [apiKey, setApiKey] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generationType, setGenerationType] = useState<keyof typeof GENERATION_TYPES>('recipe');
  const [customPrompt, setCustomPrompt] = useState('');
  const [language, setLanguage] = useState('English');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [progress, setProgress] = useState<GenerationProgress>({});

  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) setApiKey(savedApiKey);
    
    const savedHistory = localStorage.getItem('generationHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const generateContent = async (keyword: string) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = customPrompt || GENERATION_TYPES[generationType].defaultPrompt;
    const fullPrompt = `${prompt} ${keyword}\n\nGenerate in ${language} language.`;

    // Update progress
    setProgress(prev => ({
      ...prev,
      [keyword]: 0
    }));

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => ({
        ...prev,
        [keyword]: Math.min((prev[keyword] || 0) + 10, 90)
      }));
    }, 500);

    try {
      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();

      clearInterval(progressInterval);
      setProgress(prev => ({
        ...prev,
        [keyword]: 100
      }));

      return {
        id: Date.now().toString(),
        type: generationType,
        name: keyword.trim(),
        text,
        timestamp: Date.now(),
        progress: 100
      };
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(prev => ({
        ...prev,
        [keyword]: -1
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
      
      for (const keyword of keywordList) {
        const content = await generateContent(keyword);
        setHistory(prev => [content, ...prev]);
      }
      
      setLoading(false);
      setKeywords('');
      localStorage.setItem('generationHistory', JSON.stringify(history));
    } catch (err) {
      setError('Failed to generate content. Please check your API key and try again.');
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('generationHistory');
  };

  const renderProgress = (keyword: string) => {
    const currentProgress = progress[keyword];
    if (!currentProgress) return null;

    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            currentProgress === -1 
              ? 'bg-red-500' 
              : currentProgress === 100 
                ? 'bg-green-500'
                : 'bg-blue-500'
          }`}
          style={{ width: `${currentProgress === -1 ? 100 : currentProgress}%` }}
        />
      </div>
    );
  };

  const renderContent = (content: GeneratedContent) => {
    const TypeIcon = GENERATION_TYPES[content.type].Icon;
    const typeColor = GENERATION_TYPES[content.type].color;

    return (
      <div key={content.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className={`bg-${typeColor}-50 p-4 border-b border-${typeColor}-100`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TypeIcon className={`w-6 h-6 text-${typeColor}-600`} />
              <div>
                <h3 className="font-semibold text-gray-900">{content.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(content.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleCopy(content.text, content.id)}
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
          {renderProgress(content.name)}
          
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-800">{content.text}</pre>
          </div>

          {content.imagePrompt && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-purple-900">Midjourney Prompt</h4>
                <button
                  onClick={() => handleCopy(content.imagePrompt!, content.id + '-prompt')}
                  className="p-1 hover:bg-purple-100 rounded-full transition-colors"
                >
                  {copiedId === content.id + '-prompt' ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-purple-600" />
                  )}
                </button>
              </div>
              <p className="text-purple-800 font-mono text-sm">{content.imagePrompt}</p>
            </div>
          )}

          {content.seoKeywords && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Focus Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {content.seoKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChefHat className="w-8 h-8 text-emerald-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Content Generator</h1>
              <p className="text-sm text-gray-500">Generate optimized content for multiple platforms</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {showSettings && (
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
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      localStorage.setItem('geminiApiKey', e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your API key"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
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
                  onChange={(e) => setCustomPrompt(e.target.value)}
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
                  onChange={(e) => setLanguage(e.target.value)}
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
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(GENERATION_TYPES).map(([type, { label, Icon, color }]) => (
                <button
                  key={type}
                  onClick={() => setGenerationType(type as keyof typeof GENERATION_TYPES)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors
                    ${generationType === type 
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
              <>
                <span>Generate {GENERATION_TYPES[generationType].label}</span>
              </>
            )}
          </button>
        </div>

        {history.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-medium text-gray-900">Generated Content</h2>
              </div>
              <button
                onClick={clearHistory}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear History</span>
              </button>
            </div>

            <div className="grid gap-6">
              {history.map((content) => renderContent(content))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;