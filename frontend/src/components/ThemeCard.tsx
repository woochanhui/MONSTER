import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { ArrowUpRight } from 'lucide-react';

interface Theme {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  author: string;
  category: string;
}

export const ThemeCard: React.FC<{ theme: Theme }> = ({ theme }) => {
  const { setSelectedTheme } = useThemeStore();

  const getCategoryLabel = (id: string) => {
    const labels: Record<string, string> = {
      saas: 'SaaS / Tech',
      food: 'Culinary / Food',
      business: 'Real Estate',
      edu: 'Education / LMS',
      fitness: 'Fitness / Sport',
      travel: 'Travel / Culture'
    };
    return labels[id] || id;
  };

  return (
    <div 
      className="group relative bg-white rounded-[32px] overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-[0_30px_100px_rgba(0,0,0,0.12)] hover:-translate-y-2 cursor-pointer"
      onClick={() => setSelectedTheme(theme)}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={theme.imageUrl} 
          alt={theme.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Category Badge */}
        <div className="absolute top-5 left-6">
          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm">
            {getCategoryLabel(theme.category)}
          </span>
        </div>

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div className="bg-white/90 backdrop-blur-xl text-black px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-tighter flex items-center gap-2 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            Live Preview <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-black text-gray-900 tracking-tighter group-hover:text-primary-blue transition-colors">
            {theme.title}
          </h3>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
          {theme.description}
        </p>
        
        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-100 to-gray-50 border border-gray-100" />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{theme.author}</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Premium Price</span>
            <span className="text-xl font-black text-gray-900 italic">
              ₩{theme.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
