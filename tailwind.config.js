/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'border-blue-500',
    'bg-blue-100',
    'text-blue-700',
    'text-blue-600',
    'border-red-500',
    'bg-red-100',
    'text-red-700',
    'text-red-600',
    'border-yellow-500',
    'bg-yellow-100',
    'text-yellow-700',
    'text-yellow-600',
    'border-green-500',
    'bg-green-100',
    'text-green-700',
    'text-green-600',
  ],
};