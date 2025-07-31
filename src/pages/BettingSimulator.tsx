
import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";

const Footer = lazy(() => import("@/components/Footer"));

const BettingSimulator = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gold">Betting Simulator</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Coming soon! Our betting simulator will help you practice and refine your betting strategies without risking real money.
          </p>
        </div>
      </main>
      <Suspense fallback={<div className="h-20" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default BettingSimulator;
