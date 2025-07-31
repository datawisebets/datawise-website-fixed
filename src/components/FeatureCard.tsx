import { memo } from "react";

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  description?: string;
}

const FeatureCard = ({ title, icon, description }: FeatureCardProps) => {
  return (
    <div
      className="glass-card p-3 feature-card h-full relative group overflow-hidden text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,215,0,0.2)]"
    >
      {/* Icon container - centered and properly sized */}
      <div className="flex items-center justify-center mb-2">
        <div className="relative inline-block group-hover:scale-110 transition-transform duration-500">
          <div className="text-gold relative z-10 p-1">
            {icon}
          </div>
        </div>
      </div>
      
      {/* Title with improved spacing */}
      <h3 className="text-sm md:text-base font-bold text-white group-hover:text-gold/90 transition-colors duration-300 mb-1">
        {title}
      </h3>
      
      {/* Optional description with better readability - hidden on mobile, visible on sm and up */}
      {description && (
        <p className="hidden sm:block text-xs text-gray-300 mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default memo(FeatureCard);
