import { Facebook, Share2, Image, ListChecks, FileText } from 'lucide-react';
import { ContentTypeConfig } from './types';

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
    defaultPrompt: `Create a Midjourney prompt in this exact format:

photo of [recipe name] with ingredients [list main ingredients] taken with an old camera, so yummy, home made, professional food photography, high-end culinary presentation, soft natural lighting, shallow depth of field, 85mm lens, f/2.8, high resolution

For recipe:`
  },
  seo: {
    label: 'WordPress SEO',
    Icon: ListChecks,
    color: 'green',
    defaultPrompt: `Create a comprehensive SEO content structure for WordPress. Format exactly as follows:

[SEO METADATA CARD]
Meta Title (60 chars): 
Meta Description (160 chars): 
Primary Keywords (5): 
Secondary Keywords (8): 
URL Slug: 

[CONTENT STRUCTURE - 1500 words]
<h1>Main Title</h1>

<h2>Introduction</h2>
[Engaging introduction with keyword placement]

<h2>What is [Topic]?</h2>
[Comprehensive explanation]

<h2>Key Benefits of [Topic]</h2>
<h3>Benefit 1</h3>
[Detailed explanation]
<h3>Benefit 2</h3>
[Detailed explanation]
<h3>Benefit 3</h3>
[Detailed explanation]

<h2>Step-by-Step Guide</h2>
<h3>Step 1: [First Step]</h3>
[Detailed instructions]
<h3>Step 2: [Second Step]</h3>
[Detailed instructions]
[Continue with all steps]

<h2>Tips and Best Practices</h2>
<ul>
[List of practical tips]
</ul>

<h2>Common Mistakes to Avoid</h2>
<ul>
[List of mistakes and solutions]
</ul>

<h2>Expert Recommendations</h2>
[Professional insights and advice]

<h2>FAQs</h2>
<h3>Question 1?</h3>
[Detailed answer]
[Continue with relevant FAQs]

<h2>Conclusion</h2>
[Summary and call to action]

For topic:`
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