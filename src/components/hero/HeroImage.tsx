import { useRef } from "react";

const HeroImage = () => {
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <div className="mt-6 sm:mt-8 md:mt-0 w-full max-w-none sm:max-w-5xl md:flex-1 relative mb-4 sm:rounded-xl overflow-hidden">
      <picture>
        {/* PNG format for mobile - relative path for development compatibility */}
        <source
          type="image/png"
          srcSet="/lovable-uploads/HeroImage-400.png 400w"
          media="(max-width: 640px)"
        />
        {/* WebP format for desktop/tablet - relative path for development compatibility */}
        <img
          ref={imageRef}
          src="/lovable-uploads/HeroImage.webp"
          alt="Datawise Dashboard"
          className="w-full h-auto object-cover"
          width="1100"
          height="660"
          loading="eager"
          decoding="async"
        />
      </picture>
    </div>
  );
};



export default HeroImage;