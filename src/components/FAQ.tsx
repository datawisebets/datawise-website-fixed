
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  faqs: {
    question: string;
    answer: string;
  }[];
}

const FAQ = ({ faqs }: FAQProps) => {
  return (
    <section id="faq" className="container mx-auto px-4 py-20 md:py-28 relative">
      {/* Decorative elements removed for Safari performance */}
      
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 text-gold">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm md:text-lg text-gray-300 max-w-3xl mx-auto">
          Everything you need to know about Datawise
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto glass-card p-6 md:p-8 relative overflow-hidden">
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => {
            // Create stable key from question content
            const stableKey = faq.question.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 20);
            return (
              <AccordionItem 
                key={stableKey} 
                value={`item-${stableKey}`} 
                className="border-b border-white/10 last:border-0 overflow-hidden"
              >
              <AccordionTrigger className="text-left font-semibold py-4 hover:text-gold group text-xs sm:text-sm md:text-base">
                <div className="flex items-center">
                  <div className="mr-3 opacity-70 text-gold/70 font-mono text-xs">
                    0{index + 1}.
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {faq.question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pb-4 pl-8 text-xs sm:text-sm leading-relaxed">
                <div className="bg-gold/5 p-3 sm:p-4 rounded-lg">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
            );
          })}
        </Accordion>
        
        {/* Bottom decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/0 via-gold/20 to-gold/0"></div>
      </div>
    </section>
  );
};

export default FAQ;
