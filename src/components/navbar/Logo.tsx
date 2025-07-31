import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface LogoProps {
  handleLogoClick: (e: React.MouseEvent) => void;
}

export const Logo = ({ handleLogoClick }: LogoProps) => {
  return (
    <Link to="/" className="flex items-center z-20" onClick={handleLogoClick}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="flex items-center"
      >
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
      </motion.div>
    </Link>
  );
};
