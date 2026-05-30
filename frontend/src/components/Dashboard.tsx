import React, { useState } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { Download, Key, Calendar, Loader2 } from 'lucide-react';
import api from '../api/axios';

export const Dashboard: React.FC = () => {
  const { purchased } = useThemeStore();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (themeId: string, title: string) => {
    setDownloadingId(themeId);
    try {
      const response = await api.get(`/api/purchases/download/${themeId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `theme-${themeId}-package.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
      alert('다운로드에 실패했습니다. 구매 여부를 확인해주세요.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] pt-12 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 mb-2 uppercase">
            내 보관함
          </h1>
          <p className="text-gray-500 font-medium">
            구매하신 프리미엄 테마 목록입니다. 언제든 다시 다운로드할 수 있습니다.
          </p>
        </header>

        {purchased.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">구매한 테마가 없습니다</h2>
            <p className="text-gray-500 mb-8">테마 스토어에서 마음에 드는 디자인을 찾아보세요.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {purchased.map((item, index) => (
              <div key={`${item.id}-${index}`} className="bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-full md:w-64 shrink-0">
                  <img 
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full aspect-[4/3] object-cover rounded-2xl"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full">
                        구매 완료
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">{item.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                          <Key className="w-3 h-3" /> 라이선스 키
                        </div>
                        <code className="text-sm font-mono font-bold text-gray-900">{item.licenseKey}</code>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                          <Calendar className="w-3 h-3" /> 결제 일시
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          {new Date(item.purchasedAt).toLocaleDateString('ko-KR', {
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDownload(item.id, item.title)}
                    disabled={downloadingId === item.id}
                    className="w-full bg-primary-blue text-white py-3 rounded-xl font-bold text-center hover:bg-primary-blue-dark transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300"
                  >
                    {downloadingId === item.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> 다운로드 중...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" /> 테마 스킨 패키지 다운로드 (.zip)
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
