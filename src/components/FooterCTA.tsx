import React from "react";

const FooterCTA = () => (
  <footer className="py-12 bg-white text-center border-t border-gray-200">
    <h2 className="text-2xl font-bold mb-4" style={{ color: '#29b3e6' }}>
      Ready to save on your loans? Let's fix it.
    </h2>
    <a
      href="#get-started"
      className="inline-block bg-primary-blue text-white font-semibold px-8 py-4 rounded-lg text-lg shadow-lg hover:bg-blue-400 transition"
      style={{ backgroundColor: '#29b3e6' }}
    >
      Get Started with Fixr
    </a>
  </footer>
);

export default FooterCTA; 