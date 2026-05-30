import React, { useState } from 'react';
import api from '../api/axios';
import { useThemeStore } from '../store/useThemeStore';
import { X, CheckCircle, Loader2 } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { cart, isCheckoutOpen, setCheckoutOpen, addPurchased } = useThemeStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isCheckoutOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Record purchase in the backend for each item in cart
      const purchasedThemes = await Promise.all(
        cart.map(async (theme) => {
          const response = await api.post('/api/purchases/verify', {
            themeId: theme.id,
            amount: theme.price.toString()
          });
          
          return {
            ...theme,
            licenseKey: response.data.licenseKey,
            downloadUrl: response.data.downloadUrl,
            purchasedAt: new Date().toISOString()
          };
        })
      );

      // Simulate a small delay for UI feedback
      setTimeout(() => {
        setSuccess(true);
        setIsProcessing(false);
        
        setTimeout(() => {
          addPurchased(purchasedThemes);
          setSuccess(false);
        }, 2000);
      }, 800);

    } catch (error) {
      console.error('Payment processing failed', error);
      alert('결제 처리 중 오류가 발생했습니다. 로그인을 확인해 주세요.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !isProcessing && !success && setCheckoutOpen(false)} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">Toss</span>
            </div>
            <span className="font-bold text-gray-900">결제 테스트</span>
          </div>
          {!isProcessing && !success && (
            <button onClick={() => setCheckoutOpen(false)} className="text-gray-400 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-8 text-center">
          {success ? (
            <div className="py-8 flex flex-col items-center animate-in slide-in-from-bottom-4">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">결제 완료!</h3>
              <p className="text-gray-500 text-sm">내 보관함으로 이동합니다...</p>
            </div>
          ) : isProcessing ? (
            <div className="py-12 flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">결제 승인 중...</p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-2">총 결제 금액</p>
              <p className="text-4xl font-black text-blue-600 mb-8">₩{total.toLocaleString()}</p>
              
              <div className="space-y-3 mb-8 text-left text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between">
                  <span>주문 상품</span>
                  <span className="font-bold text-gray-900">{cart.length}개</span>
                </div>
                <div className="flex justify-between">
                  <span>할인 금액</span>
                  <span className="font-bold text-gray-900">₩0</span>
                </div>
              </div>

              <button
                onClick={handleSimulatePayment}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
              >
                ₩{total.toLocaleString()} 결제하기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
