import { useLocation, Link } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import { Home } from "lucide-react";

const Footer = lazy(() => import("@/components/Footer"));

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative mb-8">
              <h1 className="text-9xl font-bold text-gold/20">404</h1>
              <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-medium">
                Page Not Found
              </p>
            </div>
            
            <p className="text-gray-400 text-lg mb-10">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
            
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-gold/10 border border-gold/50 text-gold rounded-lg hover:bg-gold/20 transition-all"
            >
              <Home className="h-5 w-5 mr-2" />
              Return to Home
            </Link>
          </div>
        </div>
      </main>
      
      <Suspense fallback={<div className="h-20" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default NotFound;
