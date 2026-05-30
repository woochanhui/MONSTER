import React, { useEffect } from 'react';
import { ShoppingCart, Palette, User, LogOut, LogIn, Settings } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';

export const Navbar: React.FC = () => {
  const { cart, setView, setSelectedTheme, setCartOpen, isCartOpen, fetchPurchased } = useThemeStore();
  const { user, isAuthenticated, logout, setAuth } = useAuthStore();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === 'AUTH_SUCCESS') {
        const { user, token } = event.data;
        setAuth(user, token);
        console.log('Authentication successful and synced from popup');
        // Fetch purchase history immediately after login
        fetchPurchased();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setAuth, fetchPurchased]);

  // Also fetch purchased themes on initial load if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchPurchased();
    }
  }, [isAuthenticated, fetchPurchased]);

  const openLoginPopup = () => {
    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    window.open(
      '/login',
      'Login',
      `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => {
              setSelectedTheme(null);
              setView('home');
            }}
          >
            <div className="bg-primary-blue p-1.5 rounded-lg mr-2">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              PREMIUM <span className="text-primary-blue">THEME</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              className="text-gray-600 hover:text-primary-blue font-medium"
              onClick={() => {
                setSelectedTheme(null);
                setView('home');
              }}
            >
              둘러보기
            </button>
            <button 
              className="text-gray-600 hover:text-primary-blue font-medium flex items-center gap-1"
              onClick={() => setView('dashboard')}
            >
              <User className="w-4 h-4" /> 내 보관함
            </button>

            {user?.role === 'ROLE_ADMIN' && (
              <button 
                className="text-gray-600 hover:text-primary-blue font-medium flex items-center gap-1"
                onClick={() => setView('admin')}
              >
                <Settings className="w-4 h-4" /> 관리자
              </button>
            )}
            
            <div className="h-4 w-[1px] bg-gray-200" />

            {isAuthenticated ? (
              <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <div className="w-7 h-7 bg-primary-blue rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {user?.name || user?.email || '사용자'}님
                </span>
                <button 
                  onClick={() => logout()}
                  className="p-1.5 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-all ml-1"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={openLoginPopup}
                className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-black italic uppercase rounded-full hover:bg-primary-blue transition-all transform active:scale-95 shadow-md"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            )}

            <div 
              className="relative cursor-pointer group ml-2"
              onClick={() => setCartOpen(!isCartOpen)}
            >
              <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-primary-blue transition-colors" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-sporty-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
