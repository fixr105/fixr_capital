import React from "react";

const points = [
  "Bank-level encryption",
  "No hidden fees",
  "Transparent reports showing how much you save",
  "Fixr never shares your data without permission",
];

const TrustSecurity = () => (
  <section className="py-16 bg-white">
    <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#29b3e6' }}>
      Safe. Secure. Transparent.
    </h2>
    <ul className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {points.map((point) => (
        <li
          key={point}
          className="bg-white border border-primary-blue rounded-lg px-6 py-4 text-lg shadow-sm flex items-center gap-3"
          style={{ borderColor: '#29b3e6', color: '#222' }}
        >
          <span className="text-primary-blue text-2xl" style={{ color: '#29b3e6' }}>✔</span>
          {point}
        </li>
      ))}
    </ul>
  </section>
);

export default TrustSecurity; 