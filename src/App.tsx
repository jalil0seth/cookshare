import React, { useState, useEffect } from 'react';
import { ChefHat, History, Trash2, Key, Image, FileText, ListChecks, Settings, Copy, Check } from 'lucide-react';
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
}

const GENERATION_TYPES = {
  recipe: {
    label: 'Recipe',
    Icon: ChefHat,
    defaultPrompt: `Create a detailed recipe in the following format:

Recipe Name
Description
Ingredients
Instructions (numbered)
Tips and Notes

Make it for:`
  },
  image: {
    label: 'Midjourney Prompt',
    Icon: Image,
    defaultPrompt: `Create a detailed Midjourney prompt in this format:

Main Subject Description
Style and Artistic Direction
Lighting and Atmosphere
Camera Angle and Composition
Technical Parameters (resolution, quality)

For:`
  },
  seo: {
    label: 'SEO Content',
    Icon: ListChecks,
    defaultPrompt: `Create SEO-optimized content in this format:

Meta Title (60 chars max)
Meta Description (160 chars max)
Primary Keywords (5-7)
Secondary Keywords (8-10)
Content Outline
Short Introduction (2-3 sentences)

For:`
  },
  article: {
    label: 'Blog Article',
    Icon: FileText,
    defaultPrompt: `Write a comprehensive blog article in this format:

Title
Introduction
Main Content with subheadings
Key Takeaways
Conclusion

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

  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) setApiKey(savedApiKey);
    
    const savedHistory = localStorage.getItem('generationHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const saveToHistory = (content: GeneratedContent) => {
    const newHistory = [content, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('generationHistory', JSON.stringify(newHistory));
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem('geminiApiKey', key);
  };

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

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    let content: GeneratedContent = {
      id: Date.now().toString(),
      type: generationType,
      name: keyword.trim(),
      text: text,
      timestamp: Date.now()
    };

    if (generationType === 'image') {
      content.imagePrompt = text;
    } else if (generationType === 'seo') {
      const keywordMatch = text.match(/Primary Keywords[:\n]+([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
      if (keywordMatch) {
        content.seoKeywords = keywordMatch[1]
          .split(/[,\n]/)
          .map(k => k.trim())
          .filter(k => k.length > 0);
      }
    } else if (generationType === 'recipe') {
      content.imageUrl = 'https://images.unsplash.com/photo-1556761175-b413da4baf72';
    }

    return content;
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
        saveToHistory(content);
      }
      
      setLoading(false);
      setKeywords('');
    } catch (err) {
      setError('Failed to generate content. Please check your API key and try again.');
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('generationHistory');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <ChefHat className="w-8 h-8 text-emerald-600" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">Content Generator</h1>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {showSettings && (
            <div className="mb-6 border-b pb-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Gemini API Key
                  <a href="https://makersuite.google.com/app/apikey" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="ml-2 text-emerald-600 hover:text-emerald-500 text-sm">
                    Get your API key here →
                  </a>
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={handleApiKeyChange}
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
                  placeholder={`Enter your custom prompt template (leave empty to use default)\nDefault: ${GENERATION_TYPES[generationType].defaultPrompt}`}
                  rows={4}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Language
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
              Generation Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(GENERATION_TYPES).map(([type, { label, Icon }]) => (
                <button
                  key={type}
                  onClick={() => setGenerationType(type as keyof typeof GENERATION_TYPES)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors
                    ${generationType === type 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">{label}</span>
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
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Generating...' : `Generate ${GENERATION_TYPES[generationType].label}`}
          </button>
        </div>

        {history.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <History className="w-5 h-5 text-gray-500" />
                <h2 className="ml-2 text-lg font-medium text-gray-900">Generation History</h2>
              </div>
              <button
                onClick={clearHistory}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear History
              </button>
            </div>
            
            <div className="space-y-4">
              {history.map((content) => {
                const TypeIcon = GENERATION_TYPES[content.type].Icon;
                return (
                  <div key={content.id} className="border rounded-lg p-4">
                    <div className="flex items-start">
                      {content.imageUrl && (
                        <img
                          src={content.imageUrl}
                          alt={content.name}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      )}
                      <div className={content.imageUrl ? "ml-4 flex-1" : "flex-1"}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <TypeIcon className="w-4 h-4 mr-2 text-gray-500" />
                            <h3 className="font-medium text-gray-900">{content.name}</h3>
                          </div>
                          <button
                            onClick={() => handleCopy(content.text, content.id)}
                            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                            title="Copy content"
                          >
                            {copiedId === content.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {new Date(content.timestamp).toLocaleString()}
                        </p>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-gray-700 font-sans">{content.text}</pre>
                        </div>
                        
                        {content.imagePrompt && (
                          <div className="mt-2 p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-700">Midjourney Prompt:</p>
                              <button
                                onClick={() => handleCopy(content.imagePrompt!, content.id + '-prompt')}
                                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                title="Copy prompt"
                              >
                                {copiedId === content.id + '-prompt' ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            <p className="text-sm text-gray-600">{content.imagePrompt}</p>
                          </div>
                        )}
                        
                        {content.seoKeywords && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">SEO Keywords:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {content.seoKeywords.map((keyword, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;