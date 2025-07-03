import React, { useState, useEffect, useRef } from 'react';
import { Upload, TrendingDown, Bot, Cpu, CheckCircle, Eye, Users, Building2, Home, Car, CreditCard, Briefcase, Factory, Truck, Smartphone, FileText, X, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import NegotiationArena from './components/NegotiationArena';
import NegotiationResults from './components/NegotiationResults';
import { LoanResult, UserDetails } from './types';
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import Benefits from "./components/Benefits";
import ProductOverview from "./components/ProductOverview";
import SocialProof from "./components/SocialProof";
import TrustSecurity from "./components/TrustSecurity";
import FooterCTA from "./components/FooterCTA";

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [currentStage, setCurrentStage] = useState<'main' | 'negotiation' | 'results'>('main');
  const [negotiationResult, setNegotiationResult] = useState<LoanResult | null>(null);
  const [backendData, setBackendData] = useState<unknown>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const mouseTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const sections = [
    { id: 'hero', title: 'Home', icon: Upload },
    { id: 'problem', title: 'Problem', icon: TrendingDown },
    { id: 'fixr', title: 'FIXR AI', icon: Bot },
    { id: 'how-it-works', title: 'Process', icon: Cpu }
  ];

  const loanTypes = [
    { icon: Building2, name: 'Business Loans', desc: 'Working capital & expansion' },
    { icon: Home, name: 'Home Loans', desc: 'Purchase & refinancing' },
    { icon: Car, name: 'Vehicle Loans', desc: 'Cars, bikes & commercial' },
    { icon: CreditCard, name: 'Personal Loans', desc: 'Unsecured financing' },
    { icon: Briefcase, name: 'Professional Loans', desc: 'Doctors, CAs, lawyers' },
    { icon: Factory, name: 'Equipment Finance', desc: 'Machinery & equipment' },
    { icon: Truck, name: 'Commercial Vehicle', desc: 'Trucks & fleet financing' },
    { icon: Smartphone, name: 'Digital Loans', desc: 'App-based quick loans' }
  ];

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMouseMoving(true);
      
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
      
      mouseTimeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 150);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
            setCurrentSection(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    
    // Create FormData and send to backend
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      console.log('Sending file to backend...');
      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Backend response:', result);
        setBackendData(result);
        setIsUploading(false);
        setCurrentStage('negotiation');
      } else {
        console.error('Upload failed with status:', response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error details:', errorData);
        
        // Show error message to user
        alert(`Upload failed: ${errorData.message || 'Backend server error. Please try again.'}`);
        
        // Reset to main stage instead of falling back to negotiation
        setUploadedFile(null);
        setIsUploading(false);
        setCurrentStage('main');
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Show error message to user
      alert('Failed to connect to backend server. Please ensure the server is running on port 3000.');
      
      // Reset to main stage instead of falling back to negotiation
      setUploadedFile(null);
      setIsUploading(false);
      setCurrentStage('main');
    }
  };

  const handleNegotiationComplete = (result: LoanResult) => {
    setNegotiationResult(result);
    setCurrentStage('results');
  };

  const handleUserDetailsSubmit = async (details: UserDetails) => {
    try {
      const response = await fetch('http://localhost:3000/api/user-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...details,
          loanResult: negotiationResult
        }),
      });
      
      if (response.ok) {
        alert('Your details have been submitted successfully!');
      } else {
        alert('Failed to submit details. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting details:', error);
      alert('Failed to submit details. Please try again.');
    }
  };

  const handleReset = () => {
    setCurrentStage('main');
    setUploadedFile(null);
    setNegotiationResult(null);
    setBackendData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render different stages
  if (isUploading) {
    return (
      <div className="h-screen w-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Processing Your File</h2>
          <p className="text-gray-400">Sending to FIXR AI for negotiation...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (currentStage === 'negotiation') {
    return (
      <NegotiationArena
        fileName={uploadedFile?.name || 'Unknown File'}
        onComplete={handleNegotiationComplete}
        backendData={backendData}
      />
    );
  }

  if (currentStage === 'results' && negotiationResult) {
    return (
      <NegotiationResults
        result={negotiationResult}
        onReset={handleReset}
        onUserDetailsSubmit={handleUserDetailsSubmit}
      />
    );
  }

  // Subtle mouse follower
  const MouseFollower = () => (
    <motion.div 
      className="fixed pointer-events-none z-50"
      style={{
        left: mousePosition.x - 12,
        top: mousePosition.y - 12,
        opacity: isMouseMoving ? 0.7 : 0,
        width: 24,
        height: 24,
      }}
      animate={{
        scale: isMouseMoving ? 1.2 : 1,
        boxShadow: isMouseMoving ? '0 0 24px 8px #2196f3' : '0 0 0px 0px #2196f3',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="w-6 h-6 border-2 border-blue-400 rounded-full bg-blue-400/10" />
    </motion.div>
  );

  // Clean background grid
  const BackgroundGrid = () => (
    <div className="fixed inset-0 pointer-events-none opacity-30">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(30, 144, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(30, 144, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px'
      }}></div>
    </div>
  );

  // Navigation component
  const Navigation = () => (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/sevven.png" alt="Seven Capital Logo" className="h-10 w-auto" />
          </div>
          <div className="hidden md:flex space-x-8">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => {
                  sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  currentSection === index
                    ? 'text-sky-400 bg-sky-400/10 border border-sky-400/20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  // Progress indicator
  const ProgressIndicator = () => (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30">
      <div className="flex flex-col space-y-4">
        {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth' })}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSection === index
                ? 'bg-sky-400 scale-125'
                : 'bg-gray-600 hover:bg-gray-400'
            }`}
            title={section.title}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="font-sans bg-white">
      <HeroSection />
      <HowItWorks />
      <Benefits />
      <ProductOverview />
      <SocialProof />
      <TrustSecurity />
      <FooterCTA />
    </div>
  );
}

export default App;
