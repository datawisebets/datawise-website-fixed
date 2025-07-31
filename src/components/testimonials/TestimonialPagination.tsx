
interface TestimonialPaginationProps {
  totalPages: number;
  visibleIndices: number[];
  onPageClick: (pageIndex: number) => void;
  testimonialsPerPage: number;
}

const TestimonialPagination = ({ totalPages, visibleIndices, onPageClick, testimonialsPerPage }: TestimonialPaginationProps) => {
  return (
    <div className="flex justify-center mt-4 sm:mt-6 gap-2">
      {Array.from({ length: totalPages }).map((_, i) => {
        const isActive = visibleIndices.includes(i * testimonialsPerPage);
        return (
          <button
            key={`page-${i}`}
            className={`testimonial-pagination-dot rounded-full cursor-pointer ${
              isActive ? 'bg-gold/90' : 'bg-gold/30'
            }`}
            style={{
              width: isActive ? '24px' : '8px',
              height: '8px',
              minWidth: isActive ? '24px' : '8px',
              minHeight: '8px',
              fontSize: '0',
            }}
            onClick={() => onPageClick(i)}
            aria-label={`Go to page ${i + 1}`}
          />
        );
      })}
    </div>
  );
};

export default TestimonialPagination;
