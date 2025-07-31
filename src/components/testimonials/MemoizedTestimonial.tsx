
import { memo } from "react";
import { TestimonialData } from "@/types/testimonial";
import Testimonial from "@/components/Testimonial";

interface MemoizedTestimonialProps {
  data: TestimonialData;
}

const MemoizedTestimonial = memo(({ 
  data
}: MemoizedTestimonialProps) => (
  <Testimonial data={data} />
));

MemoizedTestimonial.displayName = "MemoizedTestimonial";

export default MemoizedTestimonial;
