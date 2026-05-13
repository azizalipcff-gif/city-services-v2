import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  showAverage?: boolean;
  className?: string;
}

const RatingDisplay = ({
  rating,
  reviewCount = 0,
  size = 'md',
  showCount = true,
  showAverage = true,
  className = '',
}: RatingDisplayProps) => {
  const sizeClasses = {
    sm: {
      star: 'w-4 h-4',
      text: 'text-sm',
    },
    md: {
      star: 'w-5 h-5',
      text: 'text-base',
    },
    lg: {
      star: 'w-6 h-6',
      text: 'text-lg',
    },
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size].star} ${
              star <= Math.round(rating)
                ? 'fill-[#d4af37] text-[#d4af37]'
                : 'text-gray-500'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {renderStars()}
      {showAverage && (
        <span className={`text-white font-semibold ${sizeClasses[size].text}`}>
          {rating.toFixed(1)}
        </span>
      )}
      {showCount && reviewCount > 0 && (
        <span className={`text-gray-400 ${sizeClasses[size].text}`}>
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;
