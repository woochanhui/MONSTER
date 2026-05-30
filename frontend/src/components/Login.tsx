import React, { useState } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const response = await api.post('/api/auth/login', { email, password });
        const { accessToken } = response.data;
        
        const userResponse = await api.get('/api/users/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        setAuth(userResponse.data, accessToken);
        
        // Send user and token to parent window and close
        window.opener.postMessage({ 
          type: 'AUTH_SUCCESS', 
          user: userResponse.data, 
          token: accessToken 
        }, window.location.origin);
        window.close();
      } else {
        await api.post('/api/auth/register', { email, password, name });
        setIsLogin(true);
        alert('회원 가입이 완료되었습니다. 로그인해 주세요.');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : '요청 중 오류가 발생했습니다.';
      const axiosError = err as { response?: { data?: string } };
      setError(axiosError.response?.data || errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-black italic tracking-tighter mb-2 uppercase text-gray-900">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-500 mb-8 font-medium">
          {isLogin ? '프리미엄 테마 스토어에 오신 것을 환영합니다.' : '창의적인 여정을 함께 시작해 보세요.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all"
                placeholder="이름을 입력하세요"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all"
              placeholder="이메일 주소를 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm font-bold italic">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-primary-blue text-white font-black italic tracking-widest uppercase rounded-xl hover:bg-primary-blue/90 transition-all shadow-lg shadow-primary-blue/20"
          >
            {isLogin ? 'Sign In' : 'Join Now'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 font-medium">
            {isLogin ? "아직 계정이 없으신가요?" : "이미 계정이 있으신가요?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-blue font-black underline underline-offset-4"
            >
              {isLogin ? '회원가입' : '로그인'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
