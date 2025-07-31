import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { DesktopMenu } from "./navbar/DesktopMenu";
import { MobileMenu } from "./navbar/MobileMenu";
import { Logo } from "./navbar/Logo";
import { NavbarContainer } from "./navbar/NavbarContainer";
import { useScrollPosition } from "../hooks/useScrollPosition";

const Navbar = () => {
  const isScrolled = useScrollPosition(10);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isGuidesPage = location.pathname.includes('/blog') || location.pathname.includes('/guides');


  // Ensure page starts at top on refresh
  useEffect(() => {
    // Check if this is a page refresh using modern Navigation Timing API
    const isPageRefresh = window.performance && 
                         window.performance.getEntriesByType && 
                         window.performance.getEntriesByType('navigation').length > 0 &&
                         (window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).type === 'reload';
    
    if (isPageRefresh) {
      // This is a refresh, scroll to top
      window.scrollTo(0, 0);
    }
  }, []);

  const navLinks = [
    { title: "Features", href: "#features" },
    { title: "How It Works", href: "#how-it-works" },
    { title: "Reviews", href: "#testimonials" },
    { title: "Pricing", href: "#pricing" },
    { title: "Guides", href: "/blog" },
    { title: "FAQ", href: "#faq" },
  ];

  const handleNavLinkClick = (href: string) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }

    if (isGuidesPage && href.startsWith('#')) {
      // Navigate to homepage with anchor using client-side navigation
      navigate(`/${href}`);
      return;
    }
    
    // Handle anchor links
    if (href.startsWith('#')) {
      // Set URL hash which will trigger navigation
      window.location.hash = href;
    }
  };

  // New function to handle logo click
  const handleLogoClick = (e: React.MouseEvent) => {
    // If we're on the homepage, prevent default and scroll to top
    if (!isGuidesPage) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    // If mobile menu is open, close it
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <NavbarContainer isScrolled={isScrolled}>
        <Logo handleLogoClick={handleLogoClick} />

        {/* Desktop Menu */}
        <DesktopMenu 
          navLinks={navLinks} 
          isGuidesPage={isGuidesPage} 
          handleNavLinkClick={handleNavLinkClick}
        />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white z-[110] p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? null : <Menu size={24} />}
        </button>
      </NavbarContainer>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
        isGuidesPage={isGuidesPage}
        handleNavLinkClick={handleNavLinkClick}
        handleLogoClick={handleLogoClick}
      />
    </>
  );
};

export default Navbar;
