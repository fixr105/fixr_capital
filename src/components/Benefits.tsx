import React from "react";

const benefits = [
  {
    icon: "🤖",
    title: "Your Personal Loan Negotiator",
    desc: "I handle the awkward conversations with banks so you don't have to.",
  },
  {
    icon: "💸",
    title: "Lower Interest Rates",
    desc: "On average, users save up to X% on interest rates. That's real cash back in your life.",
  },
  {
    icon: "🧘",
    title: "Zero Hassle",
    desc: "No paperwork nightmares. No waiting in bank queues.",
  },
  {
    icon: "🔒",
    title: "100% Private & Secure",
    desc: "Your data stays yours. Always.",
  },
];

const Benefits = () => (
  <section className="py-16 bg-white">
    <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#29b3e6' }}>
      Why Fixr is Different
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {benefits.map((b) => (
        <div
          key={b.title}
          className="flex items-start gap-4 bg-white border border-primary-blue rounded-xl shadow-md p-6"
          style={{ borderColor: '#29b3e6' }}
        >
          <div className="text-3xl">{b.icon}</div>
          <div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: '#29b3e6' }}>{b.title}</h3>
            <p className="text-gray-700">{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Benefits; 