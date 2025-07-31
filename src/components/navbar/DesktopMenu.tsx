
import { motion } from "framer-motion";
import { NavLink } from "./NavLink";
import { TrackedCTA } from "@/components/ui/TrackedCTA";

interface DesktopMenuProps {
  navLinks: Array<{ title: string; href: string }>;
  isGuidesPage: boolean;
  handleNavLinkClick: (href: string) => void;
}

export const DesktopMenu = ({ navLinks, isGuidesPage, handleNavLinkClick }: DesktopMenuProps) => {
  
  return (
    <div className="hidden md:flex items-center space-x-8">
      {navLinks.map((link, index) => (
        <NavLink
          key={index}
          href={link.href}
          className="nav-link font-medium text-sm hover:text-gold transition-colors duration-200 py-2"
          onClick={() => handleNavLinkClick(link.href)}
        >
          {link.title}
        </NavLink>
      ))}
      <TrackedCTA
        ctaLocation="navbar_desktop"
        ctaVariant="secondary"
        planType="standard"
        ctaText="Get Started"
        className="bg-gold/10 border border-gold/50 hover:bg-gold/20 text-gold px-5 py-2 rounded-lg transition-all duration-200 font-medium text-sm"
      >
        Get Started
      </TrackedCTA>
    </div>
  );
};
