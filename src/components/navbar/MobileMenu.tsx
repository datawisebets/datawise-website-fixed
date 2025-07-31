import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { NavLink } from "./NavLink";
import { TrackedCTA } from "@/components/ui/TrackedCTA";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ title: string; href: string }>;
  isGuidesPage: boolean;
  handleNavLinkClick: (href: string) => void;
  handleLogoClick: (e: React.MouseEvent) => void;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  navLinks,
  isGuidesPage,
  handleNavLinkClick,
  handleLogoClick,
}: MobileMenuProps) => {
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[105] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          data-state="open"
        >
          <div className="flex justify-between items-center px-4 py-5">
            <Link to="/" className="flex items-center z-20" onClick={handleLogoClick}>
              <img 
                src="/lovable-uploads/DatawiseLogo.webp" 
                alt="Datawise Logo" 
                className="h-5 md:h-7 w-auto object-contain"
                loading="eager" 
                width="28"
                height="28"
                decoding="async"
                style={{ 
                  contentVisibility: "auto",
                  containIntrinsicSize: "28px",
                }}
              />
            </Link>
            <button
              className="text-white z-[110] p-2"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <div className="container mx-auto px-4 py-8 flex flex-col h-full overflow-y-auto">
            {navLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="border-b border-white/10 py-4"
              >
                <NavLink
                  href={link.href}
                  className="nav-link text-lg font-medium block w-full"
                  onClick={() => handleNavLinkClick(link.href)}
                >
                  {link.title}
                </NavLink>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + navLinks.length * 0.05 }}
              className="mt-8"
            >
              <TrackedCTA
                ctaLocation="navbar_mobile"
                ctaVariant="secondary"
                planType="standard"
                ctaText="Start Free Trial"
                onClick={onClose}
                className="bg-gold/10 border border-gold/50 hover:bg-gold/20 text-gold px-5 py-3 rounded-lg transition-all duration-200 font-medium text-center block w-full"
              >
                Start Free Trial
              </TrackedCTA>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
