import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  width?: number;
  height?: number;
  aspectRatio?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className,
  loading = 'lazy',
  priority = false,
  width,
  height,
  aspectRatio = '16/9'
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    // For WebP images, use directly
    if (src.endsWith('.webp')) {
      setImageSrc(src);
      return;
    }

    // For other formats, check if WebP version exists
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const img = new Image();
    img.onload = () => setImageSrc(webpSrc);
    img.onerror = () => setImageSrc(src);
    img.src = webpSrc;
  }, [src]);

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-gray-900",
        className
      )}
      style={{ 
        aspectRatio,
        ...(width && height ? { aspectRatio: `${width}/${height}` } : {})
      }}
    >
      {/* Blur placeholder */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transition-opacity duration-700",
          imageLoaded ? "opacity-0" : "opacity-100"
        )}
      />
      
      {/* Main image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          loading={priority ? 'eager' : loading}
          fetchpriority={priority ? 'high' : undefined}
          decoding="async"
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          width={width}
          height={height}
        />
      )}
    </div>
  );
}