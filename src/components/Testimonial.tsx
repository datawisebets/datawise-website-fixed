import { TestimonialData } from "@/types/testimonial";
import { memo } from "react";

interface TestimonialProps {
  data: TestimonialData;
}

const Testimonial = ({ data }: TestimonialProps) => {
  return (
    <div className="h-full py-2">
      <div className="relative">
        {/* Stats badge styled like the Get Started button */}
        {data.stats && (
          <div className="absolute -top-3 -left-1 z-10">
            <div className="bg-black text-gold text-xs font-medium px-3 sm:px-5 py-1 sm:py-1.5 rounded-full 
                          border border-gold/50 shadow-[0_0_10px_rgba(247,197,72,0.15)]">
              {data.stats}
            </div>
          </div>
        )}
        
        <div className="bg-black/40 border border-white/10 h-full flex flex-col group rounded-lg">
          
          {/* Content - made more compact on mobile */}
          <p className="text-gray-200 mb-2 px-3 sm:px-5 pt-3 sm:pt-5 flex-grow text-xs sm:text-sm leading-relaxed">{data.content}</p>
          
          {/* Result image (if provided) */}
          {data.resultImage && (
            <div className="px-3 sm:px-5 mb-2">
              <div className="rounded-lg overflow-hidden border border-white/10 shadow-lg">
                <img 
                  src={data.resultImage} 
                  alt={data.resultImageAlt ?? `${data.name}'s betting performance results`}
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          )}
          
          {/* Avatar and user details - Bottom */}
          <div className="flex items-center px-3 sm:px-5 pb-3 sm:pb-4 mt-auto border-t border-white/5 pt-2 sm:pt-4">
            <div className="mr-2 sm:mr-3 relative">
              <img
                src={data.avatar}
                alt={data.avatarAlt ?? `${data.name}'s profile picture`}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border border-gold/20 shadow-md relative z-10"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div>
              <h4 className="font-medium text-white text-xs sm:text-sm">{data.name}</h4>
              <p className="text-gray-400 text-[10px] sm:text-xs">{data.position}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Testimonial);
