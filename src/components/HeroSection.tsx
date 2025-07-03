import React from "react";

const HeroSection = () => (
  <section className="text-center py-20 bg-white text-gray-900">
    <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#29b3e6' }}>
      I'm Fixr. Let me lower your loan rates so you keep more cash.
    </h1>
    <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
      I'm your AI loan negotiator — working behind the scenes to talk to lenders, cut your interest rates, and put real money back in your pocket. No calls. No stress. Just savings.
    </p>
    <a
      href="#get-started"
      className="inline-block bg-primary-blue text-white font-semibold px-8 py-4 rounded-lg text-lg shadow-lg hover:bg-blue-400 transition"
      style={{ backgroundColor: '#29b3e6' }}
    >
      Let's Fix Your Loan →
    </a>
  </section>
);

export default HeroSection; 