import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { ChevronLeft, Layout, Type, Palette, Moon, Sun, Sparkles, Terminal, Layers, Check, Info, Tag, Monitor, Share2, MessageSquare, Heart, Bookmark, BookOpen, Menu, ExternalLink } from 'lucide-react';
import { StarRatingDisplay } from './ReviewSection';
import ReviewSection from './ReviewSection';

export const Preview: React.FC = () => {
  const { 
    selectedTheme, 
    setSelectedTheme, 
    config, 
    updateConfig, 
    addToCart, 
    cart, 
    purchased,
    previewMode,
    setPreviewMode
  } = useThemeStore();

  if (!selectedTheme) return null;

  const isInCart = cart.some(c => c.id === selectedTheme.id);
  const purchasedItem = purchased.find(p => p.id === selectedTheme.id);
  const isPurchased = !!purchasedItem;

  const fontFamilies = {
    sans: 'ui-sans-serif, system-ui, sans-serif',
    serif: 'ui-serif, Georgia, serif',
    mono: 'ui-monospace, SFMono-Regular, monospace'
  };

  const getThemeStyles = () => {
    const isDark = config.isDarkMode;
    const dc = selectedTheme.designConfig;

    if (!dc || previewMode !== 'standard') {
      return {
        container: isDark ? 'bg-[#1e1e1e]' : 'bg-white',
        header: '',
        accent: '',
        background: isDark ? 'bg-[#121212]' : (previewMode === 'tistory' ? 'bg-[#f0f0f0]' : 'bg-[#f8f9fa]'),
      };
    }

    const styles: any = {
      container: isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100',
      header: '',
      accent: '',
      background: isDark ? 'bg-black' : 'bg-zinc-100',
    };

    // Font mapping
    const fontClass = dc.fontFamily === 'serif' ? 'font-serif' : dc.fontFamily === 'mono' ? 'font-mono' : 'font-sans';
    styles.accent = fontClass;

    // Layout mapping
    if (dc.layoutType === 'centered') {
      styles.header = 'text-center border-b border-gray-100 pb-12';
      styles.accent += ' uppercase tracking-[0.2em]';
    } else {
      styles.header = 'border-l-8 pl-8 py-4';
      styles.accent += ' font-black tracking-tighter italic text-6xl';
    }

    // Background style mapping
    if (dc.backgroundStyle === 'dots') {
      styles.background = isDark 
        ? 'bg-slate-950 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]' 
        : 'bg-slate-100 bg-[radial-gradient(#00000005_1px,transparent_1px)] bg-[size:20px_20px]';
    } else if (dc.backgroundStyle === 'grid') {
      styles.background = isDark 
        ? 'bg-black' 
        : 'bg-zinc-300 bg-[linear-gradient(45deg,#eee_25%,transparent_25%,transparent_75%,#eee_75%,#eee),linear-gradient(45deg,#eee_25%,transparent_25%,transparent_75%,#eee_75%,#eee)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]';
    }

    // Special handling for travel theme background image if applicable
    if (selectedTheme.id === '6') {
      styles.background = 'bg-[url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200")] bg-cover bg-center';
      styles.header = 'py-12 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl mb-12 shadow-lg';
    }

    return styles;
  };

  const getDecoration = () => {
    const dc = selectedTheme.designConfig;
    if (!dc) return null;

    if (dc.backgroundStyle === 'dots') return <div className="absolute top-6 right-6 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-bold">ACTIVE CONFIG</div>;
    if (dc.layoutType === 'centered') return <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-stone-300" />;
    if (dc.backgroundStyle === 'grid') return <Layers className="absolute top-6 right-6 w-5 h-5 text-blue-200" />;
    
    return <Sparkles className="absolute top-6 right-6 w-5 h-5 text-primary-blue/20" />;
  };

  const themeUI = getThemeStyles();

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar Control Panel */}
      <aside className="w-full lg:w-80 bg-white border-r border-gray-100 flex flex-col h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <button
            onClick={() => setSelectedTheme(null)}
            className="flex items-center text-sm font-bold text-gray-500 hover:text-primary-blue mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> 스토어로 돌아가기
          </button>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">{selectedTheme.title}</h2>
          {/* Rating summary */}
          {selectedTheme.averageRating !== undefined && selectedTheme.reviewCount !== undefined && selectedTheme.reviewCount > 0 ? (
            <div className="flex items-center gap-2 mt-2">
              <StarRatingDisplay rating={selectedTheme.averageRating} size="sm" />
              <span className="text-xs text-gray-400">
                {selectedTheme.averageRating.toFixed(1)} ({selectedTheme.reviewCount}개의 후기)
              </span>
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-1">등록된 후기가 없습니다.</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Theme Details */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-gray-900 font-bold uppercase text-xs tracking-widest">
              <Info className="w-4 h-4" /> 상세 정보
            </div>
            {selectedTheme.version && (
              <div className="flex items-center gap-1.5 mb-2">
                <Tag className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500 font-mono">v{selectedTheme.version}</span>
              </div>
            )}
            {selectedTheme.descriptionLong && (
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{selectedTheme.descriptionLong}</p>
            )}
            {selectedTheme.features && selectedTheme.features.length > 0 && (
              <ul className="space-y-1.5">
                {selectedTheme.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                    <Check className="w-3.5 h-3.5 text-primary-blue mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Preview Context Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold uppercase text-xs tracking-widest">
              <Monitor className="w-4 h-4" /> 미리보기 환경
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPreviewMode('standard')}
                className={`py-3 text-[9px] font-black rounded-xl border-2 transition-all uppercase ${previewMode === 'standard' ? 'border-primary-blue bg-primary-blue/5 text-primary-blue shadow-sm' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
              >
                기본 디자인
              </button>
              <button
                onClick={() => setPreviewMode('velog')}
                className={`py-3 text-[9px] font-black rounded-xl border-2 transition-all uppercase ${previewMode === 'velog' ? 'border-primary-blue bg-primary-blue/5 text-primary-blue shadow-sm' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
              >
                Velog 모드
              </button>
              <button
                onClick={() => setPreviewMode('tistory')}
                className={`py-3 text-[9px] font-black rounded-xl border-2 transition-all uppercase ${previewMode === 'tistory' ? 'border-primary-blue bg-primary-blue/5 text-primary-blue shadow-sm' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
              >
                Tistory 모드
              </button>
            </div>
          </section>

          {/* Dark Mode Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold uppercase text-xs tracking-widest">
              {config.isDarkMode ? <Moon className="w-4 h-4 text-primary-blue" /> : <Sun className="w-4 h-4 text-orange-400" />}
              <span>테마 모드</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateConfig({ isDarkMode: false })}
                className={`py-3 text-xs font-bold rounded-xl border-2 transition-all ${!config.isDarkMode ? 'border-primary-blue bg-primary-blue/5 text-primary-blue shadow-sm' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
              >
                라이트 모드
              </button>
              <button
                onClick={() => updateConfig({ isDarkMode: true })}
                className={`py-3 text-xs font-bold rounded-xl border-2 transition-all ${config.isDarkMode ? 'border-primary-blue bg-primary-blue/5 text-primary-blue shadow-sm' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
              >
                다크 모드
              </button>
            </div>
          </section>

          {/* Color Section ... rest remains same ... */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold uppercase text-xs tracking-widest">
              <Palette className="w-4 h-4" /> 포인트 컬러
            </div>
            <div className="flex gap-2 flex-wrap">
              {['#0070f3', '#7928ca', '#ff0080', '#00fff2', '#f5a623', '#00ff00', '#000000', '#ffffff'].map((color) => (
                <button
                  key={color}
                  onClick={() => updateConfig({ primaryColor: color })}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${config.primaryColor === color ? 'border-primary-blue scale-110' : 'border-gray-200 shadow-inner'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold uppercase text-xs tracking-widest">
              <Type className="w-4 h-4" /> 글꼴
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['sans', 'serif', 'mono'].map((font) => (
                <button
                  key={font}
                  onClick={() => updateConfig({ fontFamily: font as 'sans' | 'serif' | 'mono' })}
                  className={`py-2 text-[10px] font-bold rounded-lg border-2 transition-all uppercase ${config.fontFamily === font ? 'border-primary-blue bg-primary-blue/5 text-primary-blue' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                >
                  {font}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase">판매가</span>
            <span className="text-xl font-black text-primary-blue italic">₩{selectedTheme.price.toLocaleString()}</span>
          </div>

          <button
            onClick={() => addToCart(selectedTheme)}
            disabled={isInCart || isPurchased}
            className={`w-full py-4 rounded-xl font-black italic uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              isInCart || isPurchased
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary-blue text-white hover:bg-primary-blue-dark shadow-lg shadow-primary-blue/20'
            }`}
          >
            {isPurchased ? '구매 완료' : isInCart ? '장바구니 담김' : '장바구니 담기'}
          </button>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className={`flex-1 overflow-y-auto transition-colors duration-500 ${themeUI.background}`}>
        <div className="p-4 lg:p-12">
          {previewMode === 'standard' ? (
            <div
              className={`max-w-4xl mx-auto shadow-2xl min-h-96 overflow-hidden flex transition-all duration-500 relative ${themeUI.container}`}
              style={{
                flexDirection: config.layout === 'left' ? 'row-reverse' : 'row',
                fontSize: `${config.fontSize}px`,
                fontFamily: fontFamilies[config.fontFamily],
                color: config.isDarkMode ? '#fff' : '#1a1a1a',
                borderColor: (selectedTheme.id === '4' || selectedTheme.id === '6') ? config.primaryColor : undefined
              }}
            >
              {getDecoration()}
              {/* Mock Blog Content */}
              <div className="flex-1 p-6 lg:p-16">
                <header className={`mb-16 relative ${themeUI.header}`} style={{ borderColor: config.primaryColor }}>
                  {selectedTheme.id === '1' && (
                    <div className="h-1 w-12 mb-6" style={{ backgroundColor: config.primaryColor }} />
                  )}
                  <h1 className={`text-5xl lg:text-6xl mb-6 leading-tight uppercase ${themeUI.accent}`}>
                    {selectedTheme.id === '6' && <span className="text-green-500 mr-2">{'>'}</span>}
                    프리미엄 경험을 <br />
                    <span style={{ color: config.primaryColor }}>디자인하는 방법</span>
                  </h1>
                </header>
                <article className="opacity-80">
                  <p className="mb-8">디지털 플랫폼을 구축하는 것은 코드 이상의 가치를 담는 일입니다. 사용자의 미적 감각과 정서적 반응을 깊이 이해하는 과정이 필요합니다.</p>
                  <div className={`p-8 mb-8 border-l-4 ${config.isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`} style={{ borderColor: config.primaryColor }}>
                    <p className="italic font-bold">"디자인은 단순히 어떻게 보이고 느껴지는가가 아니라, 어떻게 작동하는가에 대한 문제입니다."</p>
                  </div>
                </article>
              </div>
            </div>
          ) : previewMode === 'velog' ? (
            /* Velog Simulation Mockup */
            <div 
              className={`max-w-[768px] mx-auto min-h-screen p-8 lg:p-16 transition-all duration-500 ${config.isDarkMode ? 'bg-[#1e1e1e] text-[#ececec]' : 'bg-white text-[#212529]'}`}
              style={{ fontFamily: fontFamilies[config.fontFamily] }}
            >
              <header className="mb-12">
                <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 tracking-tight leading-tight">
                  구매한 테마를 내 벨로그에 <span style={{ color: config.primaryColor }}>적용하면 이런 느낌</span>입니다
                </h1>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden" />
                  <span className="font-bold">{selectedTheme.author}</span>
                </div>
                <div className="flex flex-wrap gap-3 mb-10">
                  {['React', 'TailwindCSS', 'Premium'].map(tag => (
                    <span key={tag} className="px-4 py-1 rounded-full text-sm font-bold bg-[#f1f3f5]" style={{ color: config.primaryColor }}>{tag}</span>
                  ))}
                </div>
              </header>
              <article className="text-lg leading-relaxed">
                <p>벨로그 레이아웃 시뮬레이션입니다.</p>
              </article>
            </div>
          ) : (
            /* Tistory Simulation Mockup */
            <div className={`max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 transition-all duration-500`}>
              <div 
                className={`flex-1 p-10 shadow-sm border border-gray-100 ${config.isDarkMode ? 'bg-[#1a1a1a] text-gray-200' : 'bg-white text-gray-800'}`}
                style={{ fontFamily: fontFamilies[config.fontFamily] }}
              >
                <header className="mb-12 border-b-4 pb-10" style={{ borderColor: config.primaryColor }}>
                  <h1 className="text-4xl font-black mb-4 tracking-tight">티스토리 스킨 적용 가이드: {selectedTheme.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-400 font-bold uppercase">
                    <span className="px-2 py-0.5 rounded text-white" style={{ backgroundColor: config.primaryColor }}>TISTORY</span>
                    <span>2026.05.27</span>
                  </div>
                </header>
                <article className="prose max-w-none mb-12">
                  <p className="text-lg leading-relaxed mb-6">
                    티스토리는 <strong>직접적인 HTML/CSS 편집</strong>을 지원합니다.
                  </p>
                  <div className="bg-gray-900 rounded-xl p-6 mb-8 relative group">
                    <code className="text-indigo-300 text-sm font-mono block leading-relaxed">
                      /* Tistory Custom CSS Export */<br />
                      :root &#123;<br />
                      &nbsp;&nbsp;--main-color: {config.primaryColor};<br />
                      &nbsp;&nbsp;--font-style: '{config.fontFamily}';<br />
                      &#125;
                    </code>
                  </div>
                  <h3 className="text-xl font-bold mb-4 font-serif italic">적용 순서</h3>
                  <ul className="list-decimal pl-6 space-y-3 font-medium">
                    <li>티스토리 관리자 {'>'} 스킨 편집</li>
                    <li>html 편집 {'>'} CSS 탭</li>
                    <li>위의 코드를 맨 아래에 추가</li>
                  </ul>
                </article>
              </div>
              <aside className={`w-full lg:w-72 p-8 shadow-sm border border-gray-100 self-start ${config.isDarkMode ? 'bg-[#1a1a1a] text-gray-400' : 'bg-white text-gray-500'}`}>
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-14 h-14 rounded-xl shadow-lg rotate-3 overflow-hidden">
                    <img src={selectedTheme.imageUrl} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-black text-xs uppercase tracking-tighter">My Blog</span>
                </div>
                <nav className="space-y-6">
                  <div className="font-black text-[10px] uppercase tracking-widest opacity-30">Category</div>
                  <ul className="space-y-4 text-sm font-bold">
                    <li style={{ color: config.primaryColor }}>전체보기</li>
                    <li>Development</li>
                  </ul>
                </nav>
              </aside>
            </div>
          )}
        </div>

        {/* Review Section */}
        <div className="px-4 lg:px-12 pb-12">
          <div className="max-w-4xl mx-auto border-t border-gray-200 pt-10">
            <ReviewSection themeId={selectedTheme.id} />
          </div>
        </div>
      </main>
    </div>
  );
};
