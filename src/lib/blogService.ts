// BlogPost type definition
export interface BlogPost {
  id: string; // Add id field for compatibility
  slug: string;
  title: string;
  date: string;
  readTime: string;
  image?: string;
  excerpt?: string;
  content: string;
  author?: {
    name: string;
    avatar?: string;
  };
  categories?: string[];
  featured?: boolean;
  frontmatter?: any;
}

/**
 * Optimized blog service that loads pre-built content
 * All markdown parsing is done at build time
 */

// Cache for blog content
let blogContentCache: BlogPost[] | null = null;
let blogIndexCache: BlogPost[] | null = null;

/**
 * Load blog index (lightweight metadata only)
 */
export async function loadBlogIndex(): Promise<BlogPost[]> {
  if (blogIndexCache) {
    return blogIndexCache;
  }

  try {
    const response = await fetch('/blog-index.json', {
      // Add cache-busting to ensure fresh data
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Failed to load blog index');
    }
    
    const index = await response.json();
    // Map slug to id for compatibility
    const indexWithIds = index.map((post: any) => ({
      ...post,
      id: post.slug
    }));
    blogIndexCache = indexWithIds;
    return indexWithIds;
  } catch (error) {
    console.error('Error loading blog index:', error);
    return [];
  }
}

/**
 * Load full blog content (includes HTML)
 */
async function loadBlogContent(): Promise<BlogPost[]> {
  if (blogContentCache) {
    return blogContentCache;
  }

  try {
    const response = await fetch('/blog-content.json');
    if (!response.ok) {
      throw new Error('Failed to load blog content');
    }
    
    const content = await response.json();
    // Map slug to id for compatibility
    const contentWithIds = content.map((post: any) => ({
      ...post,
      id: post.slug
    }));
    blogContentCache = contentWithIds;
    return contentWithIds;
  } catch (error) {
    console.error('Error loading blog content:', error);
    return [];
  }
}

/**
 * Get all blog posts (metadata only for performance)
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await loadBlogIndex();
  return posts;
}

/**
 * Get featured blog posts
 */
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const posts = await loadBlogIndex();
  return posts.filter(post => post.featured);
}

/**
 * Get blog posts by category
 */
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await loadBlogIndex();
  return posts.filter(post => 
    post.categories?.includes(category)
  );
}

/**
 * Get a single blog post by slug (includes full content)
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await loadBlogContent();
    const post = posts.find(p => p.slug === slug);
    
    if (!post) {
      console.error(`Blog post not found: ${slug}`);
      return null;
    }
    
    // If the post has a frontmatter property, flatten the structure
    if (post.frontmatter) {
      return {
        ...post.frontmatter,
        id: post.slug,
        slug: post.slug,
        content: post.content || '',
        // Ensure categories is always an array
        categories: post.frontmatter.categories || []
      };
    }
    
    return post;
  } catch (error) {
    console.error('Error loading blog post:', error);
    return null;
  }
}

/**
 * Get related posts based on categories
 */
export async function getRelatedPosts(
  currentSlug: string, 
  limit: number = 3
): Promise<BlogPost[]> {
  const posts = await loadBlogIndex();
  const currentPost = posts.find(p => p.slug === currentSlug);
  
  if (!currentPost || !currentPost.categories) {
    return [];
  }
  
  // Find posts with overlapping categories
  const relatedPosts = posts
    .filter(post => 
      post.slug !== currentSlug && 
      post.categories?.some(cat => currentPost.categories?.includes(cat))
    )
    .slice(0, limit);
  
  return relatedPosts;
}

/**
 * Search blog posts
 */
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const posts = await loadBlogIndex();
  const searchTerm = query.toLowerCase();
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt?.toLowerCase().includes(searchTerm) ||
    post.categories?.some(cat => cat.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get recent blog posts
 */
export async function getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  const posts = await loadBlogIndex();
  return posts.slice(0, limit);
}

/**
 * Get all unique categories from blog posts
 */
export async function getAllCategories(): Promise<string[]> {
  const posts = await loadBlogIndex();
  const categoriesSet = new Set<string>();
  
  posts.forEach(post => {
    if (post.categories && Array.isArray(post.categories)) {
      post.categories.forEach(category => {
        if (typeof category === 'string' && category.trim()) {
          categoriesSet.add(category.trim());
        }
      });
    }
  });
  
  // Convert to array, sort, and ensure uniqueness
  const uniqueCategories = Array.from(categoriesSet).sort();
  return uniqueCategories;
}

/**
 * Clear caches (useful for development)
 */
export function clearBlogCache(): void {
  blogContentCache = null;
  blogIndexCache = null;
}

/**
 * React 19 use() hook compatible functions
 * These return stable promises that can be used with the use() hook
 */

// Stable promise cache for use() hook
const promiseCache = new Map<string, Promise<any>>();

/**
 * Get a promise for all blog posts (use() hook compatible)
 */
export function getBlogPostsPromise(): Promise<BlogPost[]> {
  const key = 'all-posts';
  if (!promiseCache.has(key)) {
    const promise = getAllBlogPosts().catch((error) => {
      // Remove failed promise from cache so it can be retried
      promiseCache.delete(key);
      throw error;
    });
    promiseCache.set(key, promise);
  }
  return promiseCache.get(key)!;
}

/**
 * Get a promise for featured posts (use() hook compatible)
 */
export function getFeaturedPostsPromise(): Promise<BlogPost[]> {
  const key = 'featured-posts';
  if (!promiseCache.has(key)) {
    const promise = getFeaturedPosts().catch((error) => {
      // Remove failed promise from cache so it can be retried
      promiseCache.delete(key);
      throw error;
    });
    promiseCache.set(key, promise);
  }
  return promiseCache.get(key)!;
}

/**
 * Get a promise for a single blog post (use() hook compatible)
 */
export function getBlogPostPromise(slug: string): Promise<BlogPost | null> {
  const key = `post-${slug}`;
  if (!promiseCache.has(key)) {
    const promise = getBlogPost(slug).catch((error) => {
      // Remove failed promise from cache so it can be retried
      promiseCache.delete(key);
      throw error;
    });
    promiseCache.set(key, promise);
  }
  return promiseCache.get(key)!;
}

/**
 * Get a promise for related posts (use() hook compatible)
 */
export function getRelatedPostsPromise(currentSlug: string, limit: number = 3): Promise<BlogPost[]> {
  const key = `related-${currentSlug}-${limit}`;
  if (!promiseCache.has(key)) {
    const promise = getRelatedPosts(currentSlug, limit).catch((error) => {
      // Remove failed promise from cache so it can be retried
      promiseCache.delete(key);
      throw error;
    });
    promiseCache.set(key, promise);
  }
  return promiseCache.get(key)!;
}

/**
 * Get a promise for posts by category (use() hook compatible)
 */
export function getPostsByCategoryPromise(category: string): Promise<BlogPost[]> {
  const key = `category-${category}`;
  if (!promiseCache.has(key)) {
    const promise = getPostsByCategory(category).catch((error) => {
      // Remove failed promise from cache so it can be retried
      promiseCache.delete(key);
      throw error;
    });
    promiseCache.set(key, promise);
  }
  return promiseCache.get(key)!;
}

/**
 * Get a promise for all categories (use() hook compatible)
 */
export function getAllCategoriesPromise(): Promise<string[]> {
  const key = 'all-categories';
  if (!promiseCache.has(key)) {
    const promise = getAllCategories().catch((error) => {
      // Remove failed promise from cache so it can be retried
      promiseCache.delete(key);
      throw error;
    });
    promiseCache.set(key, promise);
  }
  return promiseCache.get(key)!;
}

/**
 * Clear promise cache (useful for development and updates)
 */
export function clearPromiseCache(): void {
  promiseCache.clear();
  clearBlogCache();
}