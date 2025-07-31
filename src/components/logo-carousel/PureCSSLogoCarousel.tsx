import { memo, useMemo } from "react";
import logoData from "./logoData";

const PureCSSLogoCarousel = () => {
  // Triple the logos for seamless infinite scroll (need enough content for -50% transform)
  const duplicatedLogos = useMemo(() => [...logoData, ...logoData, ...logoData], []);
  
  return (
    <section id="logo-carousel" className="w-full py-4 md:py-6 bg-background">
      <div className="container mx-auto text-center mb-2 md:mb-4">
        <h3 className="text-xs md:text-sm text-gray-400 uppercase tracking-wide font-medium">
          Supported Platforms
        </h3>
      </div>
      
      <div className="relative overflow-hidden">
        {/* Subtle gradient masks for fade effect - optimized for Safari */}
        <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        {/* CSS animated carousel track */}
        <div className="logo-carousel-track flex items-center gap-8 md:gap-12 lg:gap-16 flex-nowrap" style={{ width: 'max-content' }}>
          {duplicatedLogos.map((logo, index) => {
            // Create unique key using path and position to avoid collisions in tripled array
            const originalIndex = index % logoData.length;
            const cycleNumber = Math.floor(index / logoData.length);
            return (
              <div
                key={`${logo.path}-cycle${cycleNumber}-${originalIndex}`}
                className="flex-shrink-0 flex items-center justify-center opacity-80"
              style={{ width: "150px", height: "70px" }}
            >
              <img
                src={logo.path}
                alt={logo.alt}
                className="object-contain"
                loading="lazy"
                decoding="async"
                style={{
                  maxWidth: "120px",
                  height: "auto",
                  minHeight: "32px",
                  maxHeight: "50px",
                  filter: "brightness(0.92) contrast(1.15)",
                }}
                width="120"
                height="50"
              />
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(PureCSSLogoCarousel);