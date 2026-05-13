import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  reviewCount?: number;
  className?: string;
}

const StarRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'md',
  showCount = false,
  reviewCount = 0,
  className = ''
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleStarClick = (starValue: number) => {
    if (readonly || !onRatingChange) return;
    
    const newRating = starValue;
    setCurrentRating(newRating);
    onRatingChange(newRating);
  };

  const handleStarHover = (starValue: number) => {
    if (readonly) return;
    setHoverRating(starValue);
  };

  const handleStarLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const displayRating = hoverRating || currentRating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div 
        className="flex items-center"
        onMouseLeave={handleStarLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors duration-200`}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= displayRating
                  ? 'text-[#d4af37] fill-[#d4af37]'
                  : 'text-gray-400 fill-transparent'
              } ${!readonly && 'hover:text-[#d4af37] hover:fill-[#d4af37]'} transition-all duration-200`}
            />
          </button>
        ))}
      </div>
      
      {(showCount || reviewCount > 0) && (
        <span className="text-sm text-gray-400 ml-2">
          {displayRating.toFixed(1)}
          {reviewCount > 0 && (
            <>
              <span className="mx-1">•</span>
              <span>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
            </>
          )}
        </span>
      )}
    </div>
  );
};

export default StarRating;
