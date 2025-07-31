import React from 'react';
import { ArticleData, BreadcrumbData, FAQData, FlexibleStructuredData, calculateWordCount, extractTextSnippet } from './StructuredData';
import type { BlogPost } from '@/lib/blogService';

// Extend BlogPost type to include optional structured data fields
interface ExtendedBlogPost extends BlogPost {
  description?: string;
  modifiedDate?: string;
  dateModified?: string;
  wordCount?: number;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

interface BlogStructuredDataProps {
  post: ExtendedBlogPost;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * Structured Data component specifically for blog posts
 * Automatically generates appropriate schema markup based on blog post data
 */
export const BlogStructuredData: React.FC<BlogStructuredDataProps> = ({ post, faqs }) => {
  // Calculate word count if not provided
  const wordCount = post.wordCount || (post.content ? calculateWordCount(post.content) : undefined);
  
  // Extract article body snippet for BlogPosting schema
  const articleBody = post.content ? extractTextSnippet(post.content, 1000) : undefined;
  
  // Build breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', url: 'https://datawisebets.com' },
    { name: 'Blog', url: 'https://datawisebets.com/blog' },
    { name: post.title, url: `https://datawisebets.com/blog/${post.slug}` }
  ];
  
  // Prepare structured data types
  const structuredDataTypes = [];
  
  // Add BlogPosting schema
  structuredDataTypes.push({
    type: 'BlogPosting' as const,
    props: {
      title: post.title,
      description: post.excerpt || post.description || '',
      image: post.image || 'https://datawisebets.com/lovable-uploads/HeroImage.webp',
      publishedDate: post.date,
      modifiedDate: post.modifiedDate || post.dateModified,
      author: post.author?.name || 'DataWiseBets',
      authorUrl: 'https://datawisebets.com/about',
      authorImage: post.author?.avatar || 'https://datawisebets.com/lovable-uploads/Logo_TransparentBackground.png',
      section: post.categories?.[0] || 'Sports Betting',
      keywords: post.categories || [],
      wordCount,
      url: `https://datawisebets.com/blog/${post.slug}`,
      articleBody,
    }
  });
  
  // Add Breadcrumb schema
  structuredDataTypes.push({
    type: 'Breadcrumb' as const,
    props: {
      items: breadcrumbItems
    }
  });
  
  // Add FAQ schema if FAQs are provided
  if (faqs && faqs.length > 0) {
    structuredDataTypes.push({
      type: 'FAQ' as const,
      props: {
        faqs
      }
    });
  }
  
  return <FlexibleStructuredData types={structuredDataTypes} />;
};

/**
 * Example usage of individual components
 */
export const BlogPostStructuredDataExample: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <>
      {/* Article/BlogPosting Schema */}
      <ArticleData
        type="BlogPosting"
        title={post.title}
        description={post.excerpt || ''}
        image={post.image || 'https://datawisebets.com/lovable-uploads/HeroImage.webp'}
        publishedDate={post.date}
        modifiedDate={post.modifiedDate}
        author={post.author?.name || 'DataWiseBets'}
        authorUrl="https://datawisebets.com/about"
        authorImage={post.author?.avatar}
        section={post.categories?.[0]}
        keywords={post.categories}
        wordCount={post.content ? calculateWordCount(post.content) : undefined}
        url={`https://datawisebets.com/blog/${post.slug}`}
        articleBody={post.content ? extractTextSnippet(post.content) : undefined}
      />
      
      {/* Breadcrumb Schema */}
      <BreadcrumbData 
        items={[
          { name: 'Home', url: 'https://datawisebets.com' },
          { name: 'Blog', url: 'https://datawisebets.com/blog' },
          { name: post.title, url: `https://datawisebets.com/blog/${post.slug}` }
        ]}
      />
      
      {/* FAQ Schema (if applicable) */}
      {post.faqs && (
        <FAQData faqs={post.faqs} />
      )}
    </>
  );
};

export default BlogStructuredData;