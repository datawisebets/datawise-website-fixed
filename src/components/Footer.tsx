import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  
  // Helper function to handle navigation to homepage sections
  const getLinkHref = (hash: string) => {
    return location.pathname === '/' ? hash : `/${hash}`;
  };
  
  return (
    <footer className="bg-black pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4 flex items-center h-8">
              <img 
                src="/lovable-uploads/DatawiseLogo.webp" 
                alt="Datawise Logo" 
                className="h-4 md:h-6 w-auto object-contain"
                width="24"
                height="24"
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-4">
              Stop guessing, start winning. Sports betting backed by data and a community of profitable bettors.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/DataWiseBets" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="Twitter/X">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/datawisebets" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="https://www.youtube.com/@datawisebets" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Betting Tools</h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li><Link to={getLinkHref("#features")} className="text-gray-400 hover:text-gold transition-colors">Betting Analytics</Link></li>
              <li><Link to={getLinkHref("#pricing")} className="text-gray-400 hover:text-gold transition-colors">Pricing</Link></li>
              <li><Link to="/betting-simulator" className="text-gray-400 hover:text-gold transition-colors">Betting Simulator</Link></li>
              <li><Link to={getLinkHref("#how-it-works")} className="text-gray-400 hover:text-gold transition-colors">How It Works</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li><Link to="/blog" className="text-gray-400 hover:text-gold transition-colors">Betting Guides</Link></li>
              <li><Link to={getLinkHref("#testimonials")} className="text-gray-400 hover:text-gold transition-colors">Success Stories</Link></li>
              <li><Link to={getLinkHref("#faq")} className="text-gray-400 hover:text-gold transition-colors">FAQ</Link></li>
              <li><a href="https://whop.com/datawise/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors">Free Trial</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-gold transition-colors">Terms of Service</Link></li>
              <li><Link to="/return-policy" className="text-gray-400 hover:text-gold transition-colors">Return Policy</Link></li>
              <li><a href="https://www.begambleaware.org/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors">Responsible Gambling</a></li>
              <li><a href="mailto:support@datawisebets.com" className="text-gray-400 hover:text-gold transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8">
          <p className="text-center text-gray-500 text-xs sm:text-sm">
            &copy; {currentYear} Datawise Bets. All rights reserved. 21+ to bet. Please gamble responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
