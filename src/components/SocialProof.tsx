import React from "react";

const testimonials = [
  {
    quote:
      "Fixr reduced my personal loan rate by 2%. That's ₹15,000 saved every year — without me lifting a finger.",
    name: "Anjali M.",
  },
  {
    quote:
      "I was paying way too much on my home loan. Fixr negotiated it down in days.",
    name: "Rajesh P.",
  },
];

const SocialProof = () => (
  <section className="py-16 bg-white">
    <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#29b3e6' }}>
      People are Saving Big with Fixr
    </h2>
    <div className="flex flex-col md:flex-row gap-8 justify-center max-w-4xl mx-auto">
      {testimonials.map((t) => (
        <div
          key={t.name}
          className="flex-1 bg-white border border-primary-blue rounded-xl shadow-md p-8"
          style={{ borderColor: '#29b3e6' }}
        >
          <p className="text-lg italic mb-4 text-gray-800">"{t.quote}"</p>
          <div className="text-right font-semibold text-primary-blue" style={{ color: '#29b3e6' }}>
            — {t.name}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default SocialProof; 