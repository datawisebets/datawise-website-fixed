import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, FileText, Download } from "lucide-react";

const legalDocuments = {
  "privacy-policy": {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information",
    pdfPath: "/legal/privacy-policy.pdf"
  },
  "terms-of-service": {
    title: "Terms of Service",
    description: "Terms and conditions for using DataWise Bets",
    pdfPath: "/legal/terms-of-service.pdf"
  },
  "eula": {
    title: "End User License Agreement",
    description: "Software license agreement for DataWise Bets services",
    pdfPath: "/legal/eula.pdf"
  },
  "return-policy": {
    title: "Return Policy",
    description: "Our refund and cancellation policy",
    pdfPath: "/legal/return-policy.pdf"
  }
};

const LegalPage = () => {
  const { docType } = useParams<{ docType: string }>();
  const document = docType ? legalDocuments[docType as keyof typeof legalDocuments] : null;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [docType]);

  if (!document) {
    return (
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar />
        <main className="flex-grow pt-32 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center py-20">
              <h1 className="text-3xl font-bold mb-4">Document Not Found</h1>
              <p className="text-gray-400 mb-8">The legal document you're looking for doesn't exist.</p>
              <Link 
                to="/" 
                className="inline-flex items-center px-6 py-3 bg-gold/10 border border-gold/50 text-gold rounded-lg hover:bg-gold/20 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-400 hover:text-gold transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 border border-white/10 rounded-xl p-8 md:p-12"
            >
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{document.title}</h1>
                  <p className="text-gray-400 text-lg">{document.description}</p>
                </div>
                <FileText className="h-12 w-12 text-gold/60 flex-shrink-0" />
              </div>

              <div className="border-t border-white/10 pt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <p className="text-gray-300 mb-4 sm:mb-0">
                    View the document below or download it for your records.
                  </p>
                  
                  <a
                    href={document.pdfPath}
                    download
                    className="inline-flex items-center justify-center px-6 py-3 bg-white/5 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download PDF
                  </a>
                </div>

                {/* Inline PDF Viewer */}
                <div className="w-full rounded-lg overflow-hidden border border-white/10 bg-gray-900">
                  <iframe 
                    src={document.pdfPath}
                    width="100%"
                    height="800"
                    className="bg-gray-900"
                    title={document.title}
                    style={{ minHeight: '800px' }}
                  />
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Legal navigation */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <h3 className="text-lg font-semibold mb-4">Other Legal Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(legalDocuments).map(([key, doc]) => {
                    if (key === docType) return null;
                    return (
                      <Link
                        key={key}
                        to={`/${key}`}
                        className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                      >
                        <h4 className="font-medium mb-1">{doc.title}</h4>
                        <p className="text-sm text-gray-400">{doc.description}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LegalPage;