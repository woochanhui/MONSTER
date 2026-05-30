import { useThemeStore } from './store/useThemeStore';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Preview } from './components/Preview';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import Login from './components/Login';

function App() {
  const { view, selectedTheme } = useThemeStore();
  
  // Simple "routing" based on pathname
  const pathname = window.location.pathname;
  if (pathname === '/login') {
    return <Login />;
  }

  return (
    <div className="min-h-screen font-sans antialiased text-gray-900">
      <Navbar />
      <CartDrawer />
      <CheckoutModal />
      
      {/* View Switcher */}
      {view === 'admin' ? (
        <AdminDashboard />
      ) : view === 'dashboard' ? (
        <Dashboard />
      ) : view === 'home' || !selectedTheme ? (
        <Home />
      ) : (
        <Preview />
      )}

      {/* Footer (Simplified) */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
            &copy; 2026 PREMIUM THEME MARKET. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
