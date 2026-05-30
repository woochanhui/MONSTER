import React, { useState } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import type { Theme } from '../store/useThemeStore';
import { Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { themes, createTheme, updateThemeAdmin, deleteTheme } = useThemeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Partial<Theme> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (theme: Theme) => {
    setEditingTheme(theme);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditingTheme({
      id: '',
      title: '',
      description: '',
      descriptionLong: '',
      price: 0,
      imageUrl: '',
      author: '',
      category: 'modern',
      version: '1.0.0',
      features: []
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 이 테마를 삭제하시겠습니까?')) {
      await deleteTheme(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTheme) return;

    try {
      if (editingTheme.id && themes.some(t => t.id === editingTheme.id)) {
        // Update
        const themeId = editingTheme.id;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...updateData } = editingTheme;
        await updateThemeAdmin(themeId, updateData);
      } else {
        // Create
        await createTheme(editingTheme);
      }
      setIsEditing(false);
      setEditingTheme(null);
    } catch (error) {
      console.error('Failed to save theme', error);
      alert('테마 저장에 실패했습니다.');
    }
  };

  const filteredThemes = themes.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#fafafa] pt-12 pb-24 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 mb-2 uppercase">
              관리자 보관함
            </h1>
            <p className="text-gray-500 font-medium">
              테마 스토어의 상품을 관리하고 새로운 디자인을 추가하세요.
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-primary-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-blue-dark transition-all shadow-lg shadow-primary-blue/20"
          >
            <Plus className="w-5 h-5" /> 새 테마 추가
          </button>
        </header>

        {/* Search Bar */}
        <div className="mb-8 relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary-blue transition-colors" />
          </div>
          <input
            type="text"
            placeholder="테마 제목 또는 작성자 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue outline-none transition-all font-medium"
          />
        </div>

        {/* Theme List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">테마 정보</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">카테고리</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">가격</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredThemes.map((theme) => (
                <tr key={theme.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-500">{theme.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={theme.imageUrl} alt={theme.title} className="w-12 h-12 object-cover rounded-lg" />
                      <div>
                        <div className="font-bold text-gray-900">{theme.title}</div>
                        <div className="text-xs text-gray-400">by {theme.author} (v{theme.version})</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase">
                      {theme.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary-blue">₩{theme.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(theme)}
                        className="p-2 text-gray-400 hover:text-primary-blue hover:bg-blue-50 rounded-lg transition-all"
                        title="수정"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(theme.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="삭제"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit/Add Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
            <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-2xl font-black italic uppercase">테마 {editingTheme?.id ? '수정' : '추가'}</h2>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-900">
                  <X className="w-6 h-6" />
                </button>
              </header>
              
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID</label>
                    <input
                      type="text"
                      disabled={!!editingTheme?.id && themes.some(t => t.id === editingTheme.id)}
                      value={editingTheme?.id || ''}
                      onChange={e => setEditingTheme({...editingTheme, id: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none disabled:opacity-50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">버전</label>
                    <input
                      type="text"
                      value={editingTheme?.version || ''}
                      onChange={e => setEditingTheme({...editingTheme, version: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">테마 제목</label>
                  <input
                    type="text"
                    value={editingTheme?.title || ''}
                    onChange={e => setEditingTheme({...editingTheme, title: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">판매 가격 (₩)</label>
                    <input
                      type="number"
                      value={editingTheme?.price || 0}
                      onChange={e => setEditingTheme({...editingTheme, price: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">카테고리</label>
                    <select
                      value={editingTheme?.category || 'modern'}
                      onChange={e => setEditingTheme({...editingTheme, category: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none"
                    >
                      <option value="minimal">Minimal</option>
                      <option value="modern">Modern</option>
                      <option value="cyber">Cyber</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">이미지 URL</label>
                  <input
                    type="text"
                    value={editingTheme?.imageUrl || ''}
                    onChange={e => setEditingTheme({...editingTheme, imageUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">작성자</label>
                  <input
                    type="text"
                    value={editingTheme?.author || ''}
                    onChange={e => setEditingTheme({...editingTheme, author: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">간략 설명</label>
                  <input
                    type="text"
                    value={editingTheme?.description || ''}
                    onChange={e => setEditingTheme({...editingTheme, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">상세 설명</label>
                  <textarea
                    value={editingTheme?.descriptionLong || ''}
                    onChange={e => setEditingTheme({...editingTheme, descriptionLong: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">주요 특징 (쉼표로 구분)</label>
                  <input
                    type="text"
                    value={editingTheme?.features?.join(', ') || ''}
                    onChange={e => setEditingTheme({...editingTheme, features: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none"
                    placeholder="반응형 디자인, 다크 모드 지원, ..."
                  />
                </div>

                <div className="pt-6 border-t border-gray-100 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-blue text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-blue-dark transition-all shadow-lg shadow-primary-blue/20"
                  >
                    <Check className="w-5 h-5" /> 저장하기
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
