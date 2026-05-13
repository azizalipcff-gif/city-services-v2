import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  type: 'logo' | 'cover' | 'gallery';
  onImageUpload: (imageUrl: string, file: File) => void;
  onImageRemove?: (imageUrl: string) => void;
  existingImages?: string[];
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'free';
  className?: string;
}

const ImageUpload = ({
  type,
  onImageUpload,
  onImageRemove,
  existingImages = [],
  maxFiles = type === 'gallery' ? 10 : 1,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  aspectRatio = 'free',
  className = '',
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>(existingImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = useCallback(async (file: File, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions if too large
          const maxWidth = 1920;
          const maxHeight = 1080;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Failed to compress image'));
                }
              },
              file.type,
              quality
            );
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  }, []);

  const validateFile = async (file: File): Promise<{ valid: boolean; error: string }> => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return { valid: false, error: `Only ${acceptedTypes.join(', ')} files are allowed` };
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return { valid: false, error: `File size must be less than ${maxSize}MB` };
    }

    // Check aspect ratio if specified
    if (aspectRatio !== 'free') {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const ratio = img.width / img.height;
            let valid = true;
            let error = '';

            switch (aspectRatio) {
              case 'square':
                if (Math.abs(ratio - 1) > 0.1) {
                  valid = false;
                  error = 'Image must be square (1:1 aspect ratio)';
                }
                break;
              case 'landscape':
                if (ratio < 1) {
                  valid = false;
                  error = 'Image must be landscape (width > height)';
                }
                break;
              case 'portrait':
                if (ratio > 1) {
                  valid = false;
                  error = 'Image must be portrait (height > width)';
                }
                break;
            }

            resolve({ valid, error });
          };
        };
      });
    }

    return { valid: true, error: '' };
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setError('');

    // Validate file
    const validation = await validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Check max files for gallery
    if (type === 'gallery' && previewImages.length >= maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Compress image
      setUploadProgress(30);
      const compressedBlob = await compressImage(file, 0.8);
      setUploadProgress(60);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadProgress(100);
        
        // Create new File object with compressed data
        const compressedFile = new File([compressedBlob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });

        onImageUpload(imageUrl, compressedFile);
        
        if (type === 'gallery') {
          setPreviewImages(prev => [...prev, imageUrl]);
        } else {
          setPreviewImages([imageUrl]);
        }

        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      };
      reader.readAsDataURL(compressedBlob);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleRemoveImage = (imageUrl: string) => {
    if (onImageRemove) {
      onImageRemove(imageUrl);
    }
    setPreviewImages(prev => prev.filter(img => img !== imageUrl));
  };

  const getUploadAreaText = () => {
    switch (type) {
      case 'logo':
        return 'Upload Logo';
      case 'cover':
        return 'Upload Cover Image';
      case 'gallery':
        return 'Upload Gallery Images';
      default:
        return 'Upload Image';
    }
  };

  const getUploadAreaDescription = () => {
    switch (type) {
      case 'logo':
        return 'Recommended: Square image (1:1), max 5MB';
      case 'cover':
        return 'Recommended: Landscape image (16:9), max 5MB';
      case 'gallery':
        return `Upload up to ${maxFiles} images, max 5MB each`;
      default:
        return `Max ${maxSize}MB`;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-[#d4af37]" />
        <h3 className="text-lg font-semibold text-white capitalize">{type} Upload</h3>
      </div>

      {/* Upload Area */}
      {(type === 'logo' || type === 'cover' || previewImages.length < maxFiles) && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#d4af37] bg-[#d4af37]/10'
              : 'border-white/20 hover:border-[#d4af37]/50 hover:bg-white/5'
          } ${uploading ? 'pointer-events-none' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleInputChange}
            className="hidden"
            multiple={type === 'gallery'}
          />

          {uploading ? (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 text-[#d4af37] mx-auto animate-spin" />
              <p className="text-white">Uploading... {uploadProgress}%</p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-[#d4af37] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-[#d4af37] mx-auto" />
              <div>
                <p className="text-white font-semibold">{getUploadAreaText()}</p>
                <p className="text-gray-400 text-sm mt-1">{getUploadAreaDescription()}</p>
              </div>
              <p className="text-gray-500 text-xs">
                Drag and drop or click to browse
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Image Previews */}
      {previewImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previewImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-white/5 rounded-lg overflow-hidden border border-white/10">
                <img
                  src={imageUrl}
                  alt={`${type} ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <button
                onClick={() => handleRemoveImage(imageUrl)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Compressed
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">Upload Guidelines:</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• Accepted formats: JPEG, PNG, WebP</li>
          <li>• Maximum file size: {maxSize}MB</li>
          <li>• Images are automatically compressed for optimal performance</li>
          <li>• Lazy loading enabled for faster page loads</li>
          {type === 'logo' && <li>• Recommended size: 500x500px (square)</li>}
          {type === 'cover' && <li>• Recommended size: 1920x1080px (landscape)</li>}
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;
