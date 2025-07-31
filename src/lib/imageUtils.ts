/**
 * Image optimization utilities
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ResponsiveImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}

/**
 * Generate a blur placeholder data URL
 */
export function generateBlurPlaceholder(
  width: number = 10,
  height: number = 10,
  color: string = '#f3f4f6'
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return `data:image/svg+xml;base64,${btoa(
      `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${color}"/></svg>`
    )}`;
  }
  
  canvas.width = width;
  canvas.height = height;
  
  // Create gradient for more realistic blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.5, adjustBrightness(color, 0.1));
  gradient.addColorStop(1, adjustBrightness(color, -0.1));
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
}

/**
 * Adjust color brightness
 */
function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount * 255));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount * 255));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount * 255));
  
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

/**
 * Calculate responsive image sizes
 */
export function calculateResponsiveSizes(
  breakpoints: Record<string, number> = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  }
): string {
  const sizes = Object.entries(breakpoints)
    .sort(([, a], [, b]) => a - b)
    .map(([name, width], index, array) => {
      if (index === array.length - 1) {
        return '100vw'; // Default for largest breakpoint
      }
      return `(max-width: ${width}px) 100vw`;
    });
  
  return sizes.join(', ');
}

/**
 * Get image dimensions from URL (for static images)
 */
export async function getImageDimensions(src: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, priority: boolean = false): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    
    if (priority) {
      link.setAttribute('fetchpriority', 'high');
    }
    
    link.onload = () => resolve();
    link.onerror = reject;
    
    document.head.appendChild(link);
  });
}

/**
 * Lazy load images with intersection observer
 */
export class LazyImageLoader {
  private observer: IntersectionObserver;
  private images: Set<HTMLImageElement> = new Set();

  constructor(options: IntersectionObserverInit = {}) {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    );
  }

  observe(img: HTMLImageElement): void {
    this.images.add(img);
    this.observer.observe(img);
  }

  unobserve(img: HTMLImageElement): void {
    this.images.delete(img);
    this.observer.unobserve(img);
  }

  disconnect(): void {
    this.observer.disconnect();
    this.images.clear();
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const dataSrc = img.dataset.src;
        
        if (dataSrc) {
          img.src = dataSrc;
          img.removeAttribute('data-src');
        }
        
        this.unobserve(img);
      }
    });
  }
}

/**
 * Image optimization configuration
 */
export const IMAGE_CONFIG = {
  formats: ['avif', 'webp', 'jpg'] as const,
  qualities: {
    low: 50,
    medium: 75,
    high: 90,
  },
  breakpoints: [640, 768, 1024, 1280, 1536, 1920],
  placeholderSize: { width: 10, height: 10 },
} as const;

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  baseSrc: string,
  widths: number[],
  format: string = 'jpg',
  quality: number = 75
): string {
  return widths
    .map((width) => {
      const optimizedSrc = `${baseSrc}?w=${width}&q=${quality}&f=${format}`;
      return `${optimizedSrc} ${width}w`;
    })
    .join(', ');
}

/**
 * Check if image format is supported
 */
export function isFormatSupported(format: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  try {
    const dataUrl = canvas.toDataURL(`image/${format}`);
    return dataUrl.indexOf(`data:image/${format}`) === 0;
  } catch {
    return false;
  }
}

/**
 * Image performance monitoring
 */
export class ImagePerformanceMonitor {
  private static instance: ImagePerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): ImagePerformanceMonitor {
    if (!ImagePerformanceMonitor.instance) {
      ImagePerformanceMonitor.instance = new ImagePerformanceMonitor();
    }
    return ImagePerformanceMonitor.instance;
  }

  startTiming(src: string): void {
    this.metrics.set(src, performance.now());
  }

  endTiming(src: string): number {
    const startTime = this.metrics.get(src);
    if (!startTime) return 0;
    
    const loadTime = performance.now() - startTime;
    this.metrics.delete(src);
    
    // Report to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'image_load_time', {
        custom_parameter: loadTime,
        image_src: src,
      });
    }
    
    return loadTime;
  }

  getAverageLoadTime(): number {
    const times = Array.from(this.metrics.values());
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }
}
