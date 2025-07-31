import { memo } from "react";

interface LogoProps {
  logo: { path: string; alt: string };
  index: number;
}

// Custom comparison function for React.memo
const areEqual = (prevProps: LogoProps, nextProps: LogoProps) => {
  // Only re-render if the logo or index has changed
  return prevProps.logo.path === nextProps.logo.path && 
         prevProps.logo.alt === nextProps.logo.alt && 
         prevProps.index === nextProps.index;
};

const Logo = ({ logo, index }: LogoProps) => (
  <div 
    key={`${logo.alt}-${index}`} 
    className="flex-shrink-0 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-300"
    style={{
      width: "150px",
      height: "70px",
      contentVisibility: "auto",
      containIntrinsicSize: "150px 70px",
    }}
  >
    {/* Logo container with standardized dimensions */}
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={logo.path}
        alt={logo.alt}
        className="object-contain"
        loading={index < 12 ? "eager" : "lazy"} // Load more logos eagerly
        style={{
          maxWidth: "120px",
          height: "auto",
          minHeight: "32px",
          maxHeight: "50px",
          filter: "brightness(0.92) contrast(1.15)",
        }}
        width="120" 
        height="50"
        decoding="async"
        onError={(e) => console.error(`Failed to load image: ${logo.path}`, e)}
      />
    </div>
  </div>
);

// Apply memo with the custom comparison function
const MemoizedLogo = memo(Logo, areEqual);

// Ensure displayName is set for debugging purposes
MemoizedLogo.displayName = "Logo";

export default MemoizedLogo;
