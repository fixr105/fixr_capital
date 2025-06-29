import React, { useState, useEffect, useRef } from 'react';
import { Upload, TrendingDown, Bot, Cpu, ArrowRight, CheckCircle, Eye, Users, Target, Building2, Home, Car, CreditCard, Briefcase, Factory, Truck, Smartphone, FileText, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NegotiationArena from './components/NegotiationArena';
import NegotiationResults from './components/NegotiationResults';
import { LoanResult, UserDetails } from './types';

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [currentStage, setCurrentStage] = useState<'main' | 'negotiation' | 'results'>('main');
  const [negotiationResult, setNegotiationResult] = useState<LoanResult | null>(null);
  const [backendData, setBackendData] = useState<any>(null);
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
      const scrollPosition = window.scrollY;
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
            <img src="/Seven.png" alt="Seven Capital" className="h-8 w-auto" />
            <span className="ml-3 text-xl font-bold text-white">Seven Capital</span>
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <BackgroundGrid />
      <MouseFollower />
      <Navigation />
      <ProgressIndicator />
      
      {/* Hero Section */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="min-h-screen flex items-center justify-center relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Seven Capital
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Where <span className="text-sky-400 font-semibold">FIXR AI</span> transforms your loan offers into 
              <span className="text-green-400 font-semibold"> better deals</span>
            </p>
            
            {/* Large Upload Area */}
            <div className="max-w-4xl mx-auto mb-8">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer ${
                  dragActive 
                    ? 'border-sky-400 bg-sky-400/10 scale-105' 
                    : 'border-gray-600 hover:border-sky-400 hover:bg-gray-800/20'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-20 h-20 text-sky-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  {dragActive ? 'Drop your loan offer here' : 'Upload Your Loan Offer'}
                </h2>
                <p className="text-xl text-gray-300 mb-4">
                  Drag and drop your PDF, DOC, or DOCX file here
                </p>
                <p className="text-gray-400 text-lg">
                  Supports files up to 10MB • Get better terms in minutes
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* File Info Display */}
            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto bg-gray-900/50 border border-sky-400/30 rounded-xl p-6 mb-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-sky-400 mr-3" />
                    <div>
                      <p className="text-white font-semibold">{uploadedFile.name}</p>
                      <p className="text-gray-300 text-sm">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="flex items-center gap-3 px-8 py-4 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 font-semibold text-lg">
                <Eye className="w-5 h-5" />
                See How It Works
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="py-20 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The <span className="text-red-400">Problem</span> with Traditional Loan Offers
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              You receive a loan offer, but you're not sure if it's the best deal available. 
              Negotiating with multiple lenders is time-consuming and complex.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingDown,
                title: "High Interest Rates",
                description: "Lenders often start with inflated rates, knowing you'll negotiate"
              },
              {
                icon: Clock,
                title: "Time-Consuming Process",
                description: "Manual negotiation takes weeks and requires multiple meetings"
              },
              {
                icon: Users,
                title: "Limited Options",
                description: "You can only negotiate with a few lenders manually"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center hover:border-red-400/50 transition-all duration-300"
              >
                <item.icon className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FIXR AI Section */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="py-20 bg-gradient-to-b from-gray-900 to-black"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
            initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Meet <span className="text-sky-400">FIXR AI</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI-powered negotiation engine that battles multiple lenders simultaneously 
              to secure you the best possible loan terms.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-sky-900/20 to-blue-900/20 border border-sky-400/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-sky-400">How FIXR AI Works</h3>
                <div className="space-y-6">
                  {[
                    "Analyzes your loan offer document",
                    "Connects to 50+ lenders simultaneously",
                    "Negotiates terms in real-time",
                    "Secures the best possible deal",
                    "Delivers results in minutes, not weeks"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-400/30 rounded-2xl p-8">
                <Bot className="w-24 h-24 text-green-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-green-400">AI-Powered Results</h3>
                <div className="space-y-4 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Savings:</span>
                    <span className="text-green-400 font-bold">₹2.5L - ₹5L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Interest Rate Reduction:</span>
                    <span className="text-green-400 font-bold">2-4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Processing Time:</span>
                    <span className="text-green-400 font-bold">5-10 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Success Rate:</span>
                    <span className="text-green-400 font-bold">94%</span>
                  </div>
                </div>
              </div>
              </motion.div>
            </div>
            </div>
      </section>

      {/* How It Works Section */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="py-20 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
            initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple <span className="text-sky-400">3-Step</span> Process
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Get better loan terms in minutes, not weeks
            </p>
              </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "1. Upload Your Offer",
                description: "Simply drag and drop your loan offer document (PDF, DOC, DOCX)"
              },
              {
                icon: Cpu,
                title: "2. AI Negotiation",
                description: "FIXR AI battles multiple lenders simultaneously to secure better terms"
              },
              {
                icon: CheckCircle,
                title: "3. Get Better Deal",
                description: "Receive your negotiated offer with significant savings in minutes"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center hover:border-sky-400/50 transition-all duration-300"
              >
                <step.icon className="w-12 h-12 text-sky-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>

              <motion.div
            initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-400 text-lg">
              Ready to get better loan terms? Upload your offer above to get started!
            </p>
              </motion.div>
        </div>
      </section>

      {/* Loan Types Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
            initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              All <span className="text-sky-400">Loan Types</span> Supported
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Whether it's a business loan, home loan, or personal loan, FIXR AI can negotiate better terms for you
            </p>
              </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loanTypes.map((loan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center hover:border-sky-400/50 hover:bg-gray-800/50 transition-all duration-300 group"
              >
                <loan.icon className="w-8 h-8 text-sky-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2 text-sm">{loan.name}</h3>
                <p className="text-xs text-gray-400">{loan.desc}</p>
              </motion.div>
            ))}
              </div>
            </div>
      </section>
    </div>
  );
}

export default App;
