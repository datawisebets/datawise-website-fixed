/**
 * Shared types for resource preloading
 * This file exists to break circular dependencies between hooks and lib files
 */

export interface PreloadOptions {
  as: 'script' | 'style' | 'image' | 'font' | 'fetch';
  crossOrigin?: 'anonymous' | 'use-credentials';
  integrity?: string;
  type?: string;
  media?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  importance?: 'high' | 'low' | 'auto'; // Legacy support
}

export interface PreinitOptions {
  as: 'script' | 'style';
  crossOrigin?: 'anonymous' | 'use-credentials';
  integrity?: string;
  precedence?: 'reset' | 'low' | 'medium' | 'high';
}