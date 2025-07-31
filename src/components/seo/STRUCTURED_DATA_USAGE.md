# Structured Data Component Usage Guide

## Overview

The StructuredData component has been enhanced to support multiple schema types including:
- Article
- BlogPosting (new - more specific than Article)
- FAQPage
- Organization
- Website
- BreadcrumbList
- SoftwareApplication

## Key Features

### 1. Enhanced Article/BlogPosting Schema
- Support for both `Article` and `BlogPosting` types
- Additional properties: `dateModified`, `authorImage`, `inLanguage`, `articleBody`
- Flexible image property (string or array)
- Optional properties with conditional rendering

### 2. Flexible Structured Data Component
- Render multiple schema types in one component
- Type-safe configuration
- Conditional rendering based on props

### 3. Utility Functions
- `calculateWordCount(htmlContent)` - Calculate word count from HTML
- `extractTextSnippet(htmlContent, maxLength)` - Extract text preview from HTML

## Usage Examples

### Basic Article/BlogPosting

```tsx
import { ArticleData } from '@/components/seo/StructuredData';

// For a blog post
<ArticleData
  type="BlogPosting"
  title={post.title}
  description={post.excerpt}
  image={post.image}
  publishedDate={post.date}
  modifiedDate={post.modifiedDate}
  author={post.author.name}
  authorUrl="https://datawisebets.com/about"
  authorImage={post.author.avatar}
  section={post.categories[0]}
  keywords={post.categories}
  wordCount={1500}
  url={`https://datawisebets.com/blog/${post.slug}`}
/>
```

### Using BlogStructuredData Helper

```tsx
import { BlogStructuredData } from '@/components/seo/BlogStructuredData';

// Automatically generates BlogPosting, Breadcrumb, and FAQ schemas
<BlogStructuredData 
  post={blogPost}
  faqs={[
    {
      question: "What is positive EV betting?",
      answer: "Positive EV betting is..."
    }
  ]}
/>
```

### Multiple Schema Types with FlexibleStructuredData

```tsx
import { FlexibleStructuredData } from '@/components/seo/StructuredData';

<FlexibleStructuredData 
  types={[
    {
      type: 'BlogPosting',
      props: {
        title: post.title,
        description: post.excerpt,
        image: post.image,
        publishedDate: post.date,
        author: post.author.name,
        // ... other props
      }
    },
    {
      type: 'Breadcrumb',
      props: {
        items: [
          { name: 'Home', url: 'https://datawisebets.com' },
          { name: 'Blog', url: 'https://datawisebets.com/blog' },
          { name: post.title, url: `https://datawisebets.com/blog/${post.slug}` }
        ]
      }
    },
    {
      type: 'FAQ',
      props: {
        faqs: post.faqs
      }
    }
  ]}
/>
```

### FAQ Schema

```tsx
import { FAQData } from '@/components/seo/StructuredData';

<FAQData 
  faqs={[
    {
      question: "How do I calculate expected value?",
      answer: "Expected value is calculated by..."
    },
    {
      question: "What makes a bet +EV?",
      answer: "A bet is considered +EV when..."
    }
  ]}
/>
```

## Integration with Blog Infrastructure

The component is designed to work seamlessly with the existing blog infrastructure:

1. **BlogPost Type**: Compatible with the `BlogPost` interface from `@/lib/blogService`
2. **Build-time Processing**: Word count and text extraction work with pre-processed HTML content
3. **SSR Compatible**: Utility functions have fallbacks for server-side rendering
4. **React 19 Ready**: Works alongside native metadata support

## Best Practices

1. **Always include required fields**: title, description, image, publishedDate, author
2. **Use BlogPosting for blog content**: More specific than Article schema
3. **Include FAQs when relevant**: Improves search visibility for question-based queries
4. **Add breadcrumbs**: Helps search engines understand site structure
5. **Calculate word count**: Use the utility function for accurate counts
6. **Provide dateModified**: Important for content freshness signals

## TypeScript Types

All components are fully typed. Key types exported:

```typescript
export type {
  BaseStructuredData,
  Article,
  BlogPosting,
  FAQPage,
  ArticleDataProps,
  FAQDataProps,
  // ... other types
};
```

## Performance Considerations

- Structured data is rendered as static JSON-LD scripts
- No runtime overhead after initial render
- Utility functions are optimized for both client and server environments
- Compatible with React 19's streaming SSR