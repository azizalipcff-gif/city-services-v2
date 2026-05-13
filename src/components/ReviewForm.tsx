import { useState, useEffect } from 'react';
import { Star, Send, X, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { reviewService } from '../services/businessService';

interface ReviewFormProps {
  businessId: string;
  existingReview?: any;
  onReviewSubmitted?: () => void;
  onCancel?: () => void;
}

const ReviewForm = ({ businessId, existingReview, onReviewSubmitted, onCancel }: ReviewFormProps) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    }
  }, [existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast('Please log in to leave a review', 'error');
      return;
    }

    if (rating === 0) {
      showToast('Please select a rating', 'error');
      return;
    }

    if (comment.trim().length < 10) {
      showToast('Please write a review with at least 10 characters', 'error');
      return;
    }

    setLoading(true);

    try {
      if (existingReview) {
        // Update existing review
        const { error } = await reviewService.update(existingReview.id, rating, comment);
        if (error) throw error;
        showToast('Review updated successfully', 'success');
      } else {
        // Create new review
        const { error } = await reviewService.create(businessId, user.id, rating, comment);
        if (error) throw error;
        showToast('Review submitted successfully', 'success');
      }

      // Reset form
      setRating(0);
      setComment('');

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Review submission error:', error);
      showToast('Failed to submit review', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;

    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await reviewService.delete(existingReview.id);
      if (error) throw error;
      showToast('Review deleted successfully', 'success');

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Review deletion error:', error);
      showToast('Failed to delete review', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoverRating || rating)
                  ? 'fill-[#d4af37] text-[#d4af37]'
                  : 'text-gray-500'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          {existingReview ? 'Edit Your Review' : 'Write a Review'}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!user ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Please log in to leave a review</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Rating
            </label>
            <div className="flex items-center gap-4">
              {renderStars()}
              <span className="text-white font-semibold">
                {rating > 0 ? `${rating}.0` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this business..."
              rows={4}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between mt-2">
              <span className="text-gray-500 text-sm">
                {comment.length}/500 characters
              </span>
              {comment.length < 10 && comment.length > 0 && (
                <span className="text-red-400 text-sm">
                  Minimum 10 characters required
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || rating === 0 || comment.trim().length < 10}
              className="flex-1 bg-[#d4af37] hover:bg-[#b8941f] text-[#071126] font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#071126] border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {existingReview ? 'Update Review' : 'Submit Review'}
                </>
              )}
            </button>

            {existingReview && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
