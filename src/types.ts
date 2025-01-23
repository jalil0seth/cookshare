export interface GeneratedContent {
  id: string;
  type: 'recipe' | 'image' | 'seo' | 'article' | 'pinterest';
  name: string;
  text: string;
  imageUrl?: string;
  imagePrompt?: string;
  seoKeywords?: string[];
  timestamp: number;
  progress?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface GenerationProgress {
  [key: string]: number;
}

export interface GroupedContent {
  [keyword: string]: GeneratedContent[];
}

export interface ContentTypeConfig {
  label: string;
  Icon: React.ComponentType<any>;
  color: string;
  defaultPrompt: string | ((lang: string, prompt: string) => string);
}