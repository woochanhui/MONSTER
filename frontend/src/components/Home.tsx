import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useThemeStore } from '../store/useThemeStore';
import { ThemeCard } from './ThemeCard';
import { Search, SlidersHorizontal } from 'lucide-react';

export const Home: React.FC = () => {
  const { themes, setThemes } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await axios.get('/api/themes');
        setThemes(response.data);
      } catch (error) {
        console.error('Failed to fetch themes', error);
      }
    };
    fetchThemes();
  }, [setThemes]);

  const filteredThemes = themes.filter((theme) => {
    const matchesSearch = theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || theme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'saas', label: 'SaaS/기술' },
    { id: 'food', label: '음식/맛집' },
    { id: 'business', label: '비즈니스' },
    { id: 'edu', label: '교육/강의' },
    { id: 'fitness', label: '운동/헬스' },
    { id: 'travel', label: '여행/문화' },
  ];

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-40 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-blue"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">New Collection 2026</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tight text-gray-900 mb-8 leading-[1.2] uppercase italic">
            Design <br />
            <span className="inline-block px-4 py-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-purple-600">Beyond</span> Limits
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            프리미엄 퀄리티와 정교한 디테일의 조화. <br />
            글로벌 톱 클래스 디자이너들이 제작한 익스클루시브 테마 컬렉션.
          </p>

          {/* Search Bar Integration */}
          <div className="mt-16 max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-gray-300 group-focus-within:text-primary-blue transition-colors" />
            </div>
            <input
              type="text"
              placeholder="찾으시는 테마 스타일이 있으신가요?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-20 pr-10 py-7 bg-white border border-gray-100 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] focus:shadow-[0_20px_60px_rgba(0,112,243,0.08)] focus:border-primary-blue/20 outline-none transition-all text-xl font-medium placeholder:text-gray-300"
            />
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-20">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3 text-primary-blue">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Curation Filter</span>
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">Featured Themes</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-gray-50 rounded-[24px] border border-gray-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-[20px] font-black text-[11px] uppercase tracking-widest transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white text-primary-blue shadow-sm'
                    : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {filteredThemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredThemes.map((theme) => (
              <ThemeCard key={theme.id} theme={theme} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
            <div className="inline-flex p-8 bg-gray-50 rounded-full mb-6">
              <Search className="w-12 h-12 text-gray-200" />
            </div>
            <p className="text-3xl font-black text-gray-900 italic mb-4 uppercase tracking-tighter">No Results Found</p>
            <p className="text-gray-400 font-medium mb-10">검색어에 맞는 테마를 찾을 수 없습니다. 필터를 초기화해보세요.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-blue transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
};
