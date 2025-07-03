import React from "react";

const steps = [
  {
    title: "Share Your Loan Details",
    desc: "Tell me about your loan. It's safe and secure — bank-level encryption.",
    icon: "🔒",
  },
  {
    title: "I Negotiate For You",
    desc: "I'll talk to your lender, analyze your options, and push for better rates.",
    icon: "🤖",
  },
  {
    title: "You Save Money",
    desc: "Enjoy lower EMIs or pay off your loan faster. I'll even show you exactly how much you'll save.",
    icon: "💸",
  },
];

const HowItWorks = () => (
  <section className="py-16 bg-white">
    <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#29b3e6' }}>
      How It Works
    </h2>
    <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-5xl mx-auto">
      {steps.map((step, idx) => (
        <div
          key={step.title}
          className="flex-1 bg-white border border-primary-blue rounded-xl shadow-md p-8 text-center"
          style={{ borderColor: '#29b3e6' }}
        >
          <div className="text-4xl mb-4">{step.icon}</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#29b3e6' }}>{step.title}</h3>
          <p className="text-gray-700">{step.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorks; 