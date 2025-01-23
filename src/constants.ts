export const RECIPE_HEADERS = {
  English: {
    ingredients: 'Ingredients',
    directions: 'Instructions',
    tips: 'Tips and Notes'
  },
  Spanish: {
    ingredients: 'Ingredientes',
    directions: 'Instrucciones',
    tips: 'Consejos y Notas'
  },
  French: {
    ingredients: 'Ingrédients',
    directions: 'Instructions',
    tips: 'Conseils et Notes'
  },
  German: {
    ingredients: 'Zutaten',
    directions: 'Anleitung',
    tips: 'Tipps und Hinweise'
  },
  Italian: {
    ingredients: 'Ingredienti',
    directions: 'Istruzioni',
    tips: 'Consigli e Note'
  }
};

import { Facebook, Share2, Image, ListChecks, FileText } from 'lucide-react';
import { ContentTypeConfig } from './types';

export const GENERATION_TYPES: Record<string, ContentTypeConfig> = {
  recipe: {
    label: 'Facebook Recipe Post',
    Icon: Facebook,
    color: 'blue',
    defaultPrompt: (lang: string, prompt: string) => `Generate a recipe in ${lang} language for: ${prompt}

Please format the response exactly like this:
[Recipe Name with Emoji, only food emoji]
[2-3 sentence description]

${RECIPE_HEADERS[lang as keyof typeof RECIPE_HEADERS].ingredients}
- [ingredients with measurements]

${RECIPE_HEADERS[lang as keyof typeof RECIPE_HEADERS].directions}
1. [detailed step]
2. [detailed step]
(continue with all steps)

${RECIPE_HEADERS[lang as keyof typeof RECIPE_HEADERS].tips}
- [helpful cooking tips]`
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
    color: 'yellow',
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
    color: 'green',
    defaultPrompt: `Write a blog post with this exact format:

<h1>SEO-optimized title</h1>

<content>
[Write the full article content here with proper paragraphs]
</content>

For topic:`
  }
};