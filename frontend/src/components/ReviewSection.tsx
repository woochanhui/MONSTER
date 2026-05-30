import React, { useEffect, useState } from 'react';
import { Star, Trash2, Pencil, X, Check, MessageSquare } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import type { Review } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';

interface StarRatingInputProps {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({ value, onChange, size = 5 }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="cursor-pointer transition-transform hover:scale-110"
        >
          <Star
            className={`transition-colors ${size === 5 ? 'w-6 h-6' : 'w-4 h-4'} ${
              star <= (hovered || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-none text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

interface StarRatingDisplayProps {
  rating: number;
  size?: 'sm' | 'md';
}

export const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({ rating, size = 'md' }) => {
  const cls = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`${cls} ${
            star <= Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-none text-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

interface ReviewItemProps {
  review: Review;
  currentUserId?: number;
  onDelete: (id: number) => void;
  onEdit: (review: Review) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, currentUserId, onDelete, onEdit }) => {
  const isOwner = currentUserId === review.userId;
  const date = new Date(review.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="border border-gray-100 rounded-xl p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800">{review.userName}</span>
            <StarRatingDisplay rating={review.rating} size="sm" />
          </div>
          <span className="text-xs text-gray-400">{date}</span>
        </div>
        {isOwner && (
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => onEdit(review)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-blue hover:bg-blue-50 transition-colors"
              title="수정"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(review.id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="삭제"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      {review.comment && (
        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
};

interface EditFormProps {
  review: Review;
  onSave: (rating: number, comment: string) => void;
  onCancel: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ review, onSave, onCancel }) => {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);

  return (
    <div className="border-2 border-primary-blue/30 rounded-xl p-4 space-y-3 bg-blue-50/30">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-primary-blue uppercase tracking-widest">후기 수정</span>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      <StarRatingInput value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        rows={3}
        className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-primary-blue transition-colors"
        placeholder="후기 내용을 입력해 주세요..."
      />
      <div className="flex gap-2">
        <button
          onClick={() => onSave(rating, comment)}
          disabled={rating === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-blue text-white text-xs font-bold rounded-lg hover:bg-primary-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-3.5 h-3.5" /> 저장
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-200 text-gray-500 text-xs font-bold rounded-lg hover:border-gray-300 transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
};

interface ReviewSectionProps {
  themeId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ themeId }) => {
  const { reviews, reviewsLoading, purchased, fetchReviews, submitReview, updateReview, deleteReview } = useThemeStore();
  const { user, isAuthenticated } = useAuthStore();

  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const isPurchased = purchased.some(p => p.id === themeId);
  const myReview = reviews.find(r => r.userId === user?.id);
  const canWrite = isPurchased && isAuthenticated && !myReview;

  useEffect(() => {
    fetchReviews(themeId);
  }, [themeId, fetchReviews]);

  const handleSubmit = async () => {
    if (newRating === 0) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await submitReview(themeId, newRating, newComment);
      setNewRating(0);
      setNewComment('');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } })?.response?.data;
      setSubmitError(msg || '후기 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('후기를 삭제하시겠습니까?')) return;
    try {
      await deleteReview(reviewId, themeId);
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleEditSave = async (rating: number, comment: string) => {
    if (!editingReview) return;
    try {
      await updateReview(editingReview.id, rating, comment);
      setEditingReview(null);
    } catch {
      alert('수정에 실패했습니다.');
    }
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-primary-blue" />
          <h3 className="text-lg font-black uppercase tracking-tight">구매자 후기</h3>
          {reviews.length > 0 && (
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {reviews.length}개
            </span>
          )}
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRatingDisplay rating={avgRating} />
            <span className="text-sm font-black text-gray-700">{avgRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Review Write Form */}
      {canWrite && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 space-y-3 hover:border-primary-blue/30 transition-colors">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">후기 작성</p>
          <StarRatingInput value={newRating} onChange={setNewRating} />
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            rows={3}
            className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-primary-blue transition-colors"
            placeholder="테마를 사용해 본 경험을 공유해 주세요. 소중한 후기가 큰 도움이 됩니다."
          />
          {submitError && (
            <p className="text-xs text-red-500">{submitError}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={newRating === 0 || submitting}
            className="px-5 py-2.5 bg-primary-blue text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '등록 중...' : '후기 등록'}
          </button>
        </div>
      )}

      {/* Purchase prompt */}
      {!isPurchased && isAuthenticated && (
        <div className="text-center py-4 text-sm text-gray-400 bg-gray-50 rounded-xl">
          구매한 회원만 후기를 작성할 수 있습니다.
        </div>
      )}

      {!isAuthenticated && (
        <div className="text-center py-4 text-sm text-gray-400 bg-gray-50 rounded-xl">
          로그인 후 구매하신 테마에 대해 후기를 남길 수 있습니다.
        </div>
      )}

      {/* Review List */}
      {reviewsLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 animate-pulse">
              <div className="h-3 bg-gray-100 rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-400">
          아직 등록된 후기가 없습니다. 첫 번째 후기의 주인공이 되어보세요!
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            editingReview?.id === review.id ? (
              <EditForm
                key={review.id}
                review={review}
                onSave={handleEditSave}
                onCancel={() => setEditingReview(null)}
              />
            ) : (
              <ReviewItem
                key={review.id}
                review={review}
                currentUserId={user?.id}
                onDelete={handleDelete}
                onEdit={setEditingReview}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
