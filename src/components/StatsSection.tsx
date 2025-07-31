const StatsSection = () => {
  const stats = [
    { value: "+$140,742.34", label: "Profit Generated" },
    { value: "+7.21%", label: "Average ROI" },
    { value: "2404-5888", label: "Win-Loss Record" },
    { value: "10,000+", label: "Active Users" },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
      
      {/* Background pattern removed for Safari performance */}
      
      {/* More subtle decorative elements */}
      {/* Background blur effects removed for Safari performance */}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gold">2023 Performance Stats</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            Join thousands of bettors who are already profiting with Datawise
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:gap-6 text-center">
          {stats.map((stat) => {
            const stableKey = stat.label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            return (
              <div
                key={stableKey}
                className="glass-card p-4 sm:p-6 md:p-8 relative overflow-hidden hover-lift flex flex-col items-center justify-center"
              >
              
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gold mb-2 sm:mb-3 relative">
                {stat.value}
              </div>
              
              <div className="text-xs sm:text-sm md:text-base text-gray-300">{stat.label}</div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;