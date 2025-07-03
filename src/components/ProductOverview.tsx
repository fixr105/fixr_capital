import React from "react";

const loans = [
  "Personal Loans",
  "Home Loans",
  "Auto Loans",
  "Student Loans",
  "Business Loans",
  "Credit Card Debt",
];

const ProductOverview = () => (
  <section className="py-16 bg-white">
    <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#29b3e6' }}>
      Fixr Works Across All Your Loans
    </h2>
    <div className="flex flex-wrap justify-center gap-6 mb-6">
      {loans.map((loan) => (
        <div
          key={loan}
          className="bg-white border border-primary-blue rounded-lg px-6 py-3 text-lg font-medium shadow-sm"
          style={{ borderColor: '#29b3e6', color: '#29b3e6' }}
        >
          {loan}
        </div>
      ))}
    </div>
    <p className="text-center text-gray-700 text-lg">
      No matter the loan, I'm ready to help lower your rates.
    </p>
  </section>
);

export default ProductOverview; 