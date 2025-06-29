import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingDown, IndianRupee, Percent, Calendar, Building, ArrowRight, User, Mail, Phone, Send } from 'lucide-react';
import { LoanResult, UserDetails } from '../types';

interface NegotiationResultsProps {
  result: LoanResult;
  onReset: () => void;
  onUserDetailsSubmit: (details: UserDetails) => void;
}

const NegotiationResults: React.FC<NegotiationResultsProps> = ({ result, onReset, onUserDetailsSubmit }) => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    email: '',
    mobile: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUserDetailsSubmit(userDetails);
    setShowUserForm(false);
  };

  return (
    <div className="min-h-screen w-screen bg-black text-blue-400 font-mono p-8 flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src="/sevven.png" alt="Seven Capital Logo" className="h-32 w-auto mx-auto" />
      </div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl font-extrabold text-blue-400 mb-2">Negotiation Complete!</div>
        <div className="text-lg text-blue-200 mb-8">FIXR AI has secured you a better deal</div>
        <div className="flex flex-col md:flex-row gap-8 justify-center mb-12">
          {/* Original Offer */}
          <div className="border-2 border-red-400 rounded-xl p-6 min-w-[300px] bg-black/60">
            <div className="text-xl font-bold text-blue-200 mb-2">↘ Original Offer</div>
            <div className="text-blue-100 text-base mb-1">Loan Amount: <span className="font-bold text-white">₹{result.originalAmount.toLocaleString('en-IN')}</span></div>
            <div className="text-blue-100 text-base mb-1">Interest Rate: <span className="font-bold text-white">{result.interestRate}</span></div>
            <div className="text-blue-100 text-base">Tenure: <span className="font-bold text-white">{result.tenure}</span></div>
          </div>
          {/* Negotiated Offer */}
          <div className="border-2 border-green-400 rounded-xl p-6 min-w-[300px] bg-black/60">
            <div className="text-xl font-bold text-blue-200 mb-2">✔ Negotiated Offer</div>
            <div className="text-blue-100 text-base mb-1">Loan Amount: <span className="font-bold text-white">₹{result.newAmount.toLocaleString('en-IN')}</span></div>
            <div className="text-blue-100 text-base mb-1">Interest Rate: <span className="font-bold text-white">{result.interestRate}</span></div>
            <div className="text-blue-100 text-base">Tenure: <span className="font-bold text-white">{result.tenure}</span></div>
          </div>
        </div>
        {/* Savings Summary */}
        <div className="w-full max-w-4xl mx-auto border-2 border-green-400 rounded-2xl bg-gradient-to-r from-green-900/40 to-blue-900/40 p-8 mb-12">
          <div className="text-3xl font-extrabold text-blue-400 mb-6 text-center">Your Savings</div>
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="flex flex-col items-center flex-1">
              <span className="text-5xl text-blue-400 mb-2"><IndianRupee className="inline w-10 h-10 align-middle" /></span>
              <div className="text-3xl font-extrabold text-white">₹{result.savings.toLocaleString('en-IN')}</div>
              <div className="text-blue-200 mt-1">Total Savings</div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-5xl text-blue-400 mb-2"><Percent className="inline w-10 h-10 align-middle" /></span>
              <div className="text-3xl font-extrabold text-white">{result.savingsPercentage}%</div>
              <div className="text-blue-200 mt-1">Savings Percentage</div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-5xl text-blue-400 mb-2"><Building className="inline w-10 h-10 align-middle" /></span>
              <div className="text-2xl font-extrabold text-white">{result.provider}</div>
              <div className="text-blue-200 mt-1">Lender</div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
          <button
            onClick={() => setShowUserForm(true)}
            className="flex items-center justify-center gap-3 px-10 py-4 bg-green-500 text-blue-400 font-bold rounded-xl text-xl hover:bg-green-600 transition-colors shadow-lg"
          >
            <Send className="w-6 h-6" />
            Get Final Offer
          </button>
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-3 px-10 py-4 bg-blue-900 text-blue-400 font-bold rounded-xl text-xl hover:bg-blue-800 transition-colors shadow-lg"
          >
            <ArrowRight className="w-6 h-6" />
            Negotiate Another
          </button>
        </div>
        {/* User Details Form Modal */}
        {showUserForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-green-400 rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-blue-400 mb-6 text-center">Get Your Final Offer</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-blue-200 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userDetails.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-blue-200 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-blue-200 mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={userDetails.mobile}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                    placeholder="Enter your mobile number"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUserForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Footer Info */}
        <div className="text-center text-blue-300 text-sm mt-8">
          <p>Processed on {new Date(result.processedAt).toLocaleString('en-IN')}</p>
          <p>File: {result.fileName}</p>
        </div>
      </div>
    </div>
  );
};

export default NegotiationResults; 