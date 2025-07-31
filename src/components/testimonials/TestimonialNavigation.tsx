
interface TestimonialNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  isAnimating: boolean;
}

const TestimonialNavigation = ({ onPrev, onNext, isAnimating }: TestimonialNavigationProps) => {
  return (
    <div className="flex justify-center mb-10 gap-4">
      <button 
        onClick={onPrev}
        className="bg-black/30 hover:bg-black/50 border border-gold/20 hover:border-gold/40 p-2 rounded-full transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
        disabled={isAnimating}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={onNext}
        className="bg-black/30 hover:bg-black/50 border border-gold/20 hover:border-gold/40 p-2 rounded-full transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
        disabled={isAnimating}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default TestimonialNavigation;
