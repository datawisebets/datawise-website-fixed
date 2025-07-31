
import { motion } from "framer-motion";
import { Clock, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const GuidesSection = () => {
  
  // Take just the first 3 posts for the homepage to make room for a direct CTA
  const featuredPosts = [
    {
      id: "1",
      title: "Does Luck Affect Sports Betting?",
      excerpt: "Understand the role of luck in sports betting and how to minimize its impact on your results.",
      image: "/lovable-uploads/blog_post_luck_in_betting.webp",
      categories: ["Strategy", "Fundamentals"],
      date: "May 15, 2023",
      readTime: "5 min read"
    },
    {
      id: "2",
      title: "Profitable Sports Betting Strategy with Positive Expected Value",
      excerpt: "Learn how to identify and capitalize on +EV bets for long-term profitability.",
      image: "/lovable-uploads/a03a1e1d-5c26-495e-9236-9fa70fe1bb5c.webp",
      categories: ["Analytics", "+EV Betting"],
      date: "June 3, 2023",
      readTime: "5 min read"
    },
    {
      id: "3",
      title: "How To Avoid Sportsbook Limits",
      excerpt: "Strategies to protect your accounts and maximize your profits without getting limited.",
      image: "/lovable-uploads/b5f948ad-b018-4291-aea6-dc5b4e591de7.webp",
      categories: ["Account Management", "Advanced"],
      date: "July 12, 2023",
      readTime: "6 min read"
    }
  ];
  
  const navigate = useNavigate();

  const handleViewAllGuides = () => {
    navigate("/guides");
    window.scrollTo(0, 0);
  };

  return (
    <section id="guides" className="container mx-auto px-4 py-12 sm:py-16 md:py-24 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Background blur effects removed for Safari performance */}
      </div>

      <div className="text-center mb-8 sm:mb-12 md:mb-16 relative z-10">
        <motion.h2 
          className="text-xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-gold">Betting Guides</span>
        </motion.h2>
        <motion.p 
          className="text-xs sm:text-sm md:text-lg text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Expert analysis, strategies, and insights to improve your betting approach
        </motion.p>
      </div>
      
      {/* Two-column grid for mobile, three columns for larger screens */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-10">
        {featuredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            className="glass-card rounded-xl overflow-hidden border border-white/10 hover-lift transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <Link to={`/guides/${post.id}`} className="block no-underline">
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                  {post.categories.slice(0, 2).map(cat => (
                    <span 
                      key={cat} 
                      className="text-[8px] sm:text-xs bg-gold/10 text-gold/90 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <h3 className="text-xs sm:text-base md:text-lg font-semibold mb-1.5 sm:mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-[8px] sm:text-xs md:text-sm text-gray-400 mb-2 sm:mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-gray-400 text-[8px] sm:text-xs">
                  <span className="text-[7px] sm:text-xs">{post.date}</span>
                  <div className="flex items-center">
                    <Clock className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 text-gold/80" />
                    <span className="text-[7px] sm:text-xs">{post.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Free Trial CTA Card - takes full width on mobile */}
        <motion.div
          className="col-span-2 md:col-span-1 glass-card rounded-xl overflow-hidden border border-gold/20 hover-lift transition-all duration-300 flex flex-col justify-center bg-black/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ 
            borderColor: "rgba(255, 215, 0, 0.4)",
            boxShadow: "0 10px 40px rgba(255, 215, 0, 0.15)"
          }}
        >
          <div className="p-4 sm:p-6 md:p-8 text-center">
            <div className="mb-3 sm:mb-6 mx-auto w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gold/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 sm:h-8 sm:w-8 md:h-10 md:w-10 text-gold" />
            </div>
            <h3 className="text-sm sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-gold">Ready to Win More?</h3>
            <p className="text-[9px] sm:text-xs md:text-sm text-gray-300 mb-3 sm:mb-5">
              Our professional guides combined with our analytics tools will drastically improve your winning rate.
            </p>
            <a
              href="https://whop.com/datawise/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-primary py-1.5 sm:py-2 md:py-3 rounded-lg inline-flex items-center justify-center text-[10px] sm:text-xs md:text-sm"
            >
              Start Free Trial
            </a>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 sm:mt-8 md:mt-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={handleViewAllGuides}
            className="inline-flex items-center px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg border border-gold/50 bg-gold/10 text-gold hover:bg-gold/20 transition-all duration-300 text-[10px] sm:text-xs md:text-sm"
          >
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            View All Guides
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default GuidesSection;
