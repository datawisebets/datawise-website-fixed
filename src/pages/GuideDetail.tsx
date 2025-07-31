import { useParams, Link } from "react-router-dom";
import { lazy, Suspense, use } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Clock, Calendar, Share2, ChevronRight } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";

const Footer = lazy(() => import("@/components/Footer"));
const CTA = lazy(() => import("@/components/CTA"));
import { 
  getBlogPostPromise, 
  getRelatedPostsPromise, 
  type BlogPost 
} from "@/lib/blogService";


// Inner component that uses the use() hook
const GuideDetailContent = ({ postId }: { postId: string }) => {
  // React 19 use() hook to unwrap promises
  const guide = use(getBlogPostPromise(postId));
  const relatedGuides = guide ? use(getRelatedPostsPromise(postId, 3)) : [];
  
  if (!guide) {
    return (
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar />
        <main className="flex-grow pt-32 pb-16">
          <div className="container mx-auto px-4">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-gray-400 hover:text-gold transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Guides
            </Link>
            
            <div className="max-w-3xl mx-auto text-center py-20">
              <h1 className="text-3xl font-bold mb-4">Guide Not Found</h1>
              <p className="text-gray-400 mb-8">Sorry, the guide you're looking for doesn't exist or has been moved.</p>
              <Link 
                to="/blog" 
                className="inline-flex items-center px-6 py-3 bg-gold/10 border border-gold/50 text-gold rounded-lg hover:bg-gold/20 transition-all"
              >
                Browse All Guides
              </Link>
            </div>
          </div>
        </main>
        <Suspense fallback={<div className="h-20" />}>
          <Footer />
        </Suspense>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* React 19 Native Metadata Support */}
      <title>{guide?.title || 'Loading...'} | DataWise Bets</title>
      <link rel="canonical" href={`https://datawisebets.com/blog/${postId}`} />
      <meta name="description" content={guide?.excerpt || 'Sports betting guide'} />
      <meta property="og:title" content={guide?.title || 'DataWise Bets Guide'} />
      <meta property="og:description" content={guide?.excerpt || 'Sports betting guide'} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`https://datawisebets.com/blog/${postId}`} />
      {guide?.image && <meta property="og:image" content={guide.image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={guide?.title || 'DataWise Bets Guide'} />
      <meta name="twitter:description" content={guide?.excerpt || 'Sports betting guide'} />
      {guide?.image && <meta name="twitter:image" content={guide.image} />}
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-gray-400 hover:text-gold transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Guides
            </Link>
            
            {/* Categories */}
            {guide.categories && guide.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {guide.categories.map(category => (
                  <Link
                    key={category}
                    to={`/blog?category=${category}`}
                    className="text-sm bg-gold/10 text-gold/90 px-3 py-1 rounded-full hover:bg-gold/20 transition-all"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}
            
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {guide.title}
            </motion.h1>
            
            <div className="flex items-center text-gray-400 mb-8">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gold/80" />
                <span>{guide.date}</span>
              </div>
              <span className="mx-3">•</span>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gold/80" />
                <span>{guide.readTime}</span>
              </div>
            </div>
            
            {guide.image && (
              <motion.div
                className="mb-10 rounded-xl overflow-hidden"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <OptimizedImage
                  src={guide.image}
                  alt={guide.title}
                  className="rounded-xl"
                  priority={true}
                  aspectRatio="16/9"
                />
              </motion.div>
            )}
            
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              {/* Main content */}
              <div className="md:w-2/3 lg:w-3/4">
                <article className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 shadow-xl">
                  <div 
                    className="prose prose-invert prose-gold max-w-none 
                    prose-headings:mb-6 prose-headings:mt-8 prose-headings:font-bold
                    prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:font-bold prose-h1:mt-0 prose-h1:mb-8 prose-h1:text-white 
                    prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-6 prose-h2:text-gold/90
                    prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-5 prose-h3:text-white/90
                    prose-h4:text-lg prose-h4:font-medium prose-h4:mt-6 prose-h4:mb-4 prose-h4:text-gold/80
                    prose-h5:text-base prose-h5:font-medium prose-h5:mt-4 prose-h5:mb-3 prose-h5:text-white/80
                    prose-h6:text-sm prose-h6:font-medium prose-h6:mt-4 prose-h6:mb-2 prose-h6:text-white/70
                    prose-p:my-8 prose-p:leading-relaxed prose-p:text-white/80
                    prose-ul:my-8 prose-ul:pl-6 prose-li:my-3 prose-li:text-white/80
                    prose-ol:my-8 prose-ol:pl-6 prose-ol:mb-8 prose-ol:mt-8
                    prose-strong:text-gold/90 prose-strong:font-semibold
                    prose-blockquote:border-l-4 prose-blockquote:border-gold/50 prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:my-8 prose-blockquote:bg-white/5 prose-blockquote:rounded-r-md prose-blockquote:pr-4
                    prose-img:rounded-lg prose-img:my-8 prose-img:mx-auto prose-img:shadow-lg prose-img:max-h-[500px] prose-img:object-cover
                    prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-gold/80
                    prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                    prose-pre:code:bg-transparent prose-pre:code:p-0
                    [&_pre_code]:text-white/90 [&_pre_code_.keyword]:text-blue-400 [&_pre_code_.function]:text-yellow-300
                    [&_pre_code_.string]:text-green-400 [&_pre_code_.comment]:text-gray-500 [&_pre_code_.operator]:text-purple-400
                    prose-table:border-collapse prose-table:w-full prose-table:my-8
                    prose-th:bg-white/10 prose-th:p-2 prose-th:text-left prose-th:border prose-th:border-white/20
                    prose-td:p-2 prose-td:border prose-td:border-white/10
                    prose-a:text-gold hover:prose-a:text-gold/80 prose-a:transition-colors 
                    [&>*]:mb-8"
                    dangerouslySetInnerHTML={{ __html: guide.content }}
                  />
                  
                  {/* Share buttons */}
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-400">Share this article:</div>
                      <div className="flex space-x-4">
                        <button className="text-gray-400 hover:text-gold transition-colors">
                          <Share2 className="h-5 w-5" />
                        </button>
                        {/* Add more share options here */}
                      </div>
                    </div>
                  </div>
                </article>
              </div>
              
              {/* Sidebar */}
              <div className="md:w-1/3 lg:w-1/4">
                <div className="sticky top-32">
                  {/* Author info */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                    <div className="flex flex-col">
                      {/* Author name and logo */}
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mr-4">
                          {guide.author?.avatar ? (
                            <img 
                              src={guide.author.avatar} 
                              alt={guide.author.name || 'Author'} 
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <span className="text-gold font-bold text-lg">D</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-xl">{guide.author?.name || 'Datawise'}</h3>
                        </div>
                      </div>
                      
                      {/* Divider */}
                      <div className="border-t border-white/10 my-3"></div>
                      
                      {/* X link */}
                      <div className="flex items-center">
                        <span className="text-gray-400 text-sm mr-3">Follow:</span>
                        <a 
                          href="https://x.com/DataWiseBets" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center bg-gray-800/90 hover:bg-gray-700 rounded-full px-3 py-1.5 text-white transition-colors"
                          aria-label="Follow DataWiseBets on X"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="14" 
                            height="14" 
                            viewBox="0 0 1200 1227" 
                            fill="currentColor" 
                            className="mr-2"
                          >
                            <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"/>
                          </svg>
                          <span className="font-medium text-sm">@DataWiseBets</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Table of Contents - enhanced implementation */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 hidden lg:block">
                    <h3 className="font-semibold mb-4 text-gold/90">Table of Contents</h3>
                    <nav className="space-y-3 text-sm">
                      {(() => {
                        // Create a temporary DOM element to parse the HTML content
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = guide.content;

                        // Get all heading elements (h1-h6)
                        const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');

                        return Array.from(headings).map((heading, index) => {
                          const headingLevel = parseInt(heading.tagName.charAt(1));

                          // Skip h1 as it's usually the title
                          if (headingLevel === 1) return null;

                          // Extract the text content (removes HTML tags)
                          const title = heading.textContent || '';

                          // Get the existing ID from the heading element, or generate one
                          const id = heading.id || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

                          // Indentation based on heading level - using predefined classes
                          const getIndentClass = (level: number) => {
                            switch (level) {
                              case 2: return 'pl-0';
                              case 3: return 'pl-4';
                              case 4: return 'pl-8';
                              case 5: return 'pl-12';
                              case 6: return 'pl-16';
                              default: return 'pl-0';
                            }
                          };
                          const indentClass = getIndentClass(headingLevel);

                          // Font size based on heading level
                          const textSizeClass = headingLevel <= 2 ? 'text-sm font-medium' : 'text-xs';

                          // Border color and thickness based on heading level
                          const getBorderClass = (level: number) => {
                            switch (level) {
                              case 2: return 'border-l-4 border-gold/50';
                              case 3: return 'border-l-2 border-white/30';
                              case 4: return 'border-l-2 border-white/20';
                              case 5: return 'border-l border-white/15';
                              case 6: return 'border-l border-white/10';
                              default: return 'border-l-2 border-white/20';
                            }
                          };
                          const borderClass = getBorderClass(headingLevel);

                          return (
                            <a
                              key={index}
                              href={`#${id}`}
                              className={`block text-white/70 hover:text-gold transition-all duration-200 ${indentClass} ${borderClass} hover:border-gold/60 ${textSizeClass} py-1.5 hover:bg-white/5 rounded-r-md`}
                            >
                              {title}
                            </a>
                          );
                        }).filter(Boolean);
                      })()}
                    </nav>
                  </div>
                  
                  {/* Related posts */}
                  {relatedGuides.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <h3 className="font-semibold mb-4">Related Guides</h3>
                      <div className="space-y-4">
                        {relatedGuides.map(post => (
                          <Link 
                            key={post.id}
                            to={`/blog/${post.id}`}
                            className="flex items-start space-x-3 group"
                          >
                            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                              <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-gold transition-colors">
                                {post.title}
                              </h4>
                              <p className="text-xs text-gray-400 mt-1">{post.date}</p>
                            </div>
                          </Link>
                        ))}
                        
                        <Link 
                          to="/blog"
                          className="inline-flex items-center text-xs text-gold hover:text-gold/80 transition-colors"
                        >
                          View all guides
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* CTA Section after blog content */}
      <Suspense fallback={<div className="h-40" />}>
        <CTA />
      </Suspense>
      
      <Footer />
    </div>
  );
};

// Loading component for Suspense fallback
const GuideDetailLoading = () => (
  <div className="flex flex-col min-h-screen bg-black">
    <Navbar />
    <main className="flex-grow pt-32 pb-16">
      <div className="container mx-auto px-4">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-gray-400 hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Guides
        </Link>
        
        <div className="max-w-3xl mx-auto text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
          <p className="text-gray-400">Loading guide...</p>
        </div>
      </div>
    </main>
    <Suspense fallback={<div className="h-20" />}>
      <Footer />
    </Suspense>
  </div>
);

// Main component with Suspense boundary
const GuideDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  
  if (!postId) {
    return <GuideDetailLoading />;
  }
  
  return (
    <Suspense fallback={<GuideDetailLoading />}>
      <GuideDetailContent postId={postId} />
    </Suspense>
  );
};

export default GuideDetail;
