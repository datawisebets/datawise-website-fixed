import React from 'react';

// Base structured data types
interface BaseStructuredData {
  '@context': string;
  '@type': string;
}

interface Organization extends BaseStructuredData {
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
  contactPoint: {
    '@type': 'ContactPoint';
    contactType: string;
    email?: string;
    url?: string;
  };
}

interface WebSite extends BaseStructuredData {
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: string;
  };
  potentialAction: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

interface Article extends BaseStructuredData {
  '@type': 'Article';
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person' | 'Organization';
    name: string;
    url?: string;
    image?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
      width: number;
      height: number;
    };
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  articleSection?: string;
  wordCount?: number;
  keywords?: string[];
  inLanguage?: string;
  url?: string;
}

interface BlogPosting extends BaseStructuredData {
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person' | 'Organization';
    name: string;
    url?: string;
    image?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
      width: number;
      height: number;
    };
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  articleSection?: string;
  wordCount?: number;
  keywords?: string[];
  inLanguage?: string;
  url?: string;
  articleBody?: string;
  blogPost?: {
    '@type': 'BlogPosting';
    headline: string;
    alternativeHeadline?: string;
  };
}

interface BreadcrumbList extends BaseStructuredData {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

interface FAQPage extends BaseStructuredData {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

interface SoftwareApplication extends BaseStructuredData {
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
    availability: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
    worstRating: number;
  };
}

// Component props interfaces
interface StructuredDataProps {
  data: BaseStructuredData | BaseStructuredData[];
}

interface OrganizationDataProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  email?: string;
  socialLinks?: string[];
}

interface ArticleDataProps {
  title: string;
  description: string;
  image: string | string[];
  publishedDate: string;
  modifiedDate?: string;
  author: string;
  authorUrl?: string;
  authorImage?: string;
  section?: string;
  keywords?: string[];
  wordCount?: number;
  type?: 'Article' | 'BlogPosting';
  url?: string;
  inLanguage?: string;
  articleBody?: string;
}

interface BreadcrumbDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

interface FAQDataProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * Generic Structured Data Component
 */
export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  const jsonLd = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item, null, 2),
          }}
        />
      ))}
    </>
  );
};

/**
 * Organization Structured Data
 */
export const OrganizationData: React.FC<OrganizationDataProps> = ({
  name = 'Datawise Bets',
  url = 'https://datawisebets.com',
  logo = 'https://datawisebets.com/favicon/favicon-96x96.png',
  description = 'Turn sports betting into a reliable side income with data-driven insights and tools.',
  email = 'support@datawisebets.com',
  socialLinks = [],
}) => {
  const organizationData: Organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    sameAs: socialLinks,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email,
      url: `${url}/contact`,
    },
  };

  return <StructuredData data={organizationData} />;
};

/**
 * Website Structured Data
 */
export const WebSiteData: React.FC = () => {
  const websiteData: WebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Datawise Bets',
    url: 'https://datawisebets.com',
    description: 'Data-driven sports betting insights and tools for profitable betting.',
    publisher: {
      '@type': 'Organization',
      name: 'Datawise Bets',
      logo: 'https://datawisebets.com/favicon/favicon-96x96.png',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://datawisebets.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return <StructuredData data={websiteData} />;
};

/**
 * Article Structured Data
 */
export const ArticleData: React.FC<ArticleDataProps> = ({
  title,
  description,
  image,
  publishedDate,
  modifiedDate,
  author,
  authorUrl,
  authorImage,
  section,
  keywords = [],
  wordCount,
  type = 'Article',
  url,
  inLanguage = 'en-US',
  articleBody,
}) => {
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Ensure image is always an array for schema compatibility
  const imageArray = Array.isArray(image) ? image : [image];
  
  // Base properties common to both Article and BlogPosting
  const baseArticleData = {
    '@context': 'https://schema.org',
    headline: title,
    description,
    image: imageArray,
    datePublished: publishedDate,
    ...(modifiedDate && { dateModified: modifiedDate }),
    author: {
      '@type': 'Person',
      name: author,
      ...(authorUrl && { url: authorUrl }),
      ...(authorImage && { image: authorImage }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Datawise Bets',
      logo: {
        '@type': 'ImageObject',
        url: 'https://datawisebets.com/favicon/favicon-96x96.png',
        width: 96,
        height: 96,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
    ...(section && { articleSection: section }),
    ...(wordCount && { wordCount }),
    ...(keywords.length > 0 && { keywords }),
    inLanguage,
    ...(url && { url }),
  };

  // Create the appropriate schema based on type
  const structuredData = type === 'BlogPosting' 
    ? {
        ...baseArticleData,
        '@type': 'BlogPosting' as const,
        ...(articleBody && { articleBody }),
      } as BlogPosting
    : {
        ...baseArticleData,
        '@type': 'Article' as const,
      } as Article;

  return <StructuredData data={structuredData} />;
};

/**
 * Breadcrumb Structured Data
 */
export const BreadcrumbData: React.FC<BreadcrumbDataProps> = ({ items }) => {
  const breadcrumbData: BreadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <StructuredData data={breadcrumbData} />;
};

/**
 * FAQ Structured Data
 */
export const FAQData: React.FC<FAQDataProps> = ({ faqs }) => {
  const faqData: FAQPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <StructuredData data={faqData} />;
};

/**
 * Software Application Structured Data (for betting tools)
 */
export const SoftwareApplicationData: React.FC = () => {
  const appData: SoftwareApplication = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Datawise Bets Betting Simulator',
    description: 'Advanced sports betting simulator with data-driven insights and strategy testing.',
    url: 'https://datawisebets.com/betting-simulator',
    applicationCategory: 'Sports & Recreation',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  return <StructuredData data={appData} />;
};

/**
 * Combined Structured Data for Homepage
 */
export const HomepageStructuredData: React.FC = () => {
  return (
    <>
      <OrganizationData />
      <WebSiteData />
    </>
  );
};

/**
 * Flexible Structured Data Component
 * Can render multiple schema types based on configuration
 */
interface FlexibleStructuredDataProps {
  types: Array<
    | { type: 'Organization'; props?: Partial<OrganizationDataProps> }
    | { type: 'Website' }
    | { type: 'Article'; props: ArticleDataProps }
    | { type: 'BlogPosting'; props: ArticleDataProps }
    | { type: 'Breadcrumb'; props: BreadcrumbDataProps }
    | { type: 'FAQ'; props: FAQDataProps }
    | { type: 'SoftwareApplication' }
  >;
}

export const FlexibleStructuredData: React.FC<FlexibleStructuredDataProps> = ({ types }) => {
  return (
    <>
      {types.map((item, index) => {
        switch (item.type) {
          case 'Organization':
            return <OrganizationData key={index} {...item.props} />;
          case 'Website':
            return <WebSiteData key={index} />;
          case 'Article':
            return <ArticleData key={index} {...item.props} type="Article" />;
          case 'BlogPosting':
            return <ArticleData key={index} {...item.props} type="BlogPosting" />;
          case 'Breadcrumb':
            return <BreadcrumbData key={index} {...item.props} />;
          case 'FAQ':
            return <FAQData key={index} {...item.props} />;
          case 'SoftwareApplication':
            return <SoftwareApplicationData key={index} />;
          default:
            return null;
        }
      })}
    </>
  );
};

/**
 * Utility function to calculate word count from HTML content
 */
export const calculateWordCount = (htmlContent: string): number => {
  if (typeof document === 'undefined') {
    // Fallback for SSR - simple regex approach
    const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text.match(/\b\w+\b/g);
    return words ? words.length : 0;
  }
  
  // Create a temporary element to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = htmlContent;
  
  // Get text content and count words
  const text = temp.textContent || temp.innerText || '';
  const words = text.match(/\b\w+\b/g);
  
  return words ? words.length : 0;
};

/**
 * Utility function to extract text snippet from HTML content
 * (useful for articleBody property)
 */
export const extractTextSnippet = (htmlContent: string, maxLength: number = 500): string => {
  if (typeof document === 'undefined') {
    // Fallback for SSR - simple regex approach
    const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength).trim() + '...';
  }
  
  const temp = document.createElement('div');
  temp.innerHTML = htmlContent;
  
  const text = temp.textContent || temp.innerText || '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength).trim() + '...';
};

// Export all types for external use
export type {
  BaseStructuredData,
  Organization,
  WebSite,
  Article,
  BlogPosting,
  BreadcrumbList,
  FAQPage,
  SoftwareApplication,
  StructuredDataProps,
  OrganizationDataProps,
  ArticleDataProps,
  BreadcrumbDataProps,
  FAQDataProps,
  FlexibleStructuredDataProps,
};

export default StructuredData;
