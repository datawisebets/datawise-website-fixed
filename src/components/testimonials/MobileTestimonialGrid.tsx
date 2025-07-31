
import MemoizedTestimonial from "./MemoizedTestimonial";
import { TestimonialData } from "@/types/testimonial";

interface MobileTestimonialGridProps {
  testimonials: TestimonialData[];
}

const MobileTestimonialGrid = ({ testimonials }: MobileTestimonialGridProps) => {
  return (
    <div className="overflow-x-auto flex gap-4 snap-x snap-mandatory py-4 hide-scrollbar">
      {testimonials.map((testimonial) => {
        const stableKey = testimonial.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        return (
          <div key={stableKey} className="snap-center shrink-0 w-[80%] sm:w-[45%]">
            <MemoizedTestimonial data={testimonial} />
          </div>
        );
      })}
    </div>
  );
};

export default MobileTestimonialGrid;
