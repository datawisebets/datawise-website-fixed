
import { TestimonialData } from "@/types/testimonial";
import MemoizedTestimonial from "./MemoizedTestimonial";

interface DesktopTestimonialGridProps {
  testimonials: TestimonialData[];
}

const DesktopTestimonialGrid = ({ testimonials }: DesktopTestimonialGridProps) => {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={`testimonial-grid-${index}`}>
            <MemoizedTestimonial data={testimonial} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesktopTestimonialGrid;
