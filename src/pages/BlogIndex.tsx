import { useState, lazy, Suspense, use, useDeferredValue, useMemo, useTransition } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Clock, Search, Tag, ChevronRight, Filter } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";

const Footer = lazy(() => import("@/components/Footer"));

// Import from blog service with React 19 use() hook compatible functions
import { 
  getBlogPostsPromise, 
  getAllCategoriesPromise,
  type BlogPost 
} from "@/lib/blogService";

// Create the inner component that uses the use() hook
const BlogIndexContent = () => {
  // React 19 use() hook to unwrap promises
  const blogPosts = use(getBlogPostsPromise());
  const rawCategories = use(getAllCategoriesPromise());
  
  // Use useMemo to ensure categories are stable and deduplicated
  const categories = useMemo(() => {
    return [...new Set(rawCategories)];
  }, [rawCategories]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  // React 19 useDeferredValue for better search/filter performance
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const deferredCategory = useDeferredValue(selectedCategory);
  
  // Handle search with transition for better perceived performance
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setSearchQuery(e.target.value);
    });
  };
  
  // Handle category change with transition
  const handleCategoryChange = (category: string | null) => {
    startTransition(() => {
      setSelectedCategory(category);
    });
  };
  
  // Filter posts based on deferred values for better UI responsiveness
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(deferredSearchQuery.toLowerCase()) || 
                          (post.excerpt?.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ?? false);
    const matchesCategory = deferredCategory ? (post.categories?.includes(deferredCategory) ?? false) : true;
    return matchesSearch && matchesCategory;
  });
  
  
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-gold">Betting Guides & Resources</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Expert analysis, strategies, and insights to improve your betting approach
            </motion.p>
          </div>
          
          {/* Search and filter section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search guides..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-3 w-full rounded-lg bg-white/5 border border-white/10 focus:border-gold/50 focus:outline-none text-white focus:ring-1 focus:ring-gold/30 transition-all"
              />
              {/* Subtle loading indicator for transition */}
              {isPending && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto" style={{ flexWrap: 'nowrap' }}>
              <span className="text-gray-400 flex items-center flex-shrink-0">
                <Filter className="h-4 w-4 mr-1" />
                Filter:
              </span>
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap flex-shrink-0 transition-all ${
                  selectedCategory === null 
                    ? "bg-gold/20 text-gold border border-gold/50" 
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap flex-shrink-0 transition-all ${
                    selectedCategory === category 
                      ? "bg-gold/20 text-gold border border-gold/50" 
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Blog posts grid */}
          {filteredPosts.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${isPending ? 'opacity-60' : 'opacity-100'}`}>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  className="glass-card rounded-xl overflow-hidden border border-white/10 hover-lift transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: Math.min(0.1 * index, 0.5),
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <Link to={`/blog/${post.slug}`} className="block no-underline">
                    <div className="overflow-hidden">
                      <OptimizedImage
                        src={post.image}
                        alt={post.title}
                        aspectRatio="16/9"
                        className="transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.categories.map(cat => (
                            <span 
                              key={cat} 
                              className="text-xs bg-gold/10 text-gold/90 px-2 py-1 rounded-full"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h3>
                      {post.excerpt && (
                        <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between text-gray-400 text-sm">
                        <span>{post.date}</span>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gold/80" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-white/20 rounded-xl bg-white/5">
              <Tag className="h-12 w-12 mx-auto mb-4 text-gold/60" />
              <h3 className="text-2xl font-medium mb-2">No guides found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="inline-flex items-center px-4 py-2 rounded-lg border border-gold/50 bg-gold/10 text-gold hover:bg-gold/20 transition-all duration-300"
              >
                Reset filters
              </button>
            </div>
          )}
          
          {/* Featured/Popular posts section */}
          {filteredPosts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold mb-6">Popular Guides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blogPosts
                  .filter(post => post.featured)
                  .slice(0, 2)
                  .map((post, index) => (
                    <Link to={`/blog/${post.slug}`} key={post.slug} className="block">
                      <motion.div 
                        className="flex items-center p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-20 h-20 object-cover rounded-md mr-4"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium mb-1 line-clamp-2">{post.title}</h3>
                          <div className="flex items-center text-sm text-gray-400">
                            <span>{post.date}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gold/60" />
                      </motion.div>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Suspense fallback={<div className="h-20" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

// Loading component for Suspense fallback
const BlogIndexLoading = () => (
  <div className="flex flex-col min-h-screen bg-black">
    <Navbar />
    <main className="flex-grow pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gold">Betting Guides & Resources</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Expert analysis, strategies, and insights to improve your betting approach
          </p>
        </div>
        <div className="text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
          <p className="text-gray-400">Loading guides...</p>
        </div>
      </div>
    </main>
  </div>
);

// Main component with Suspense boundary
const BlogIndex = () => {
  return (
    <Suspense fallback={<BlogIndexLoading />}>
      <BlogIndexContent />
    </Suspense>
  );
};

export default BlogIndex;
