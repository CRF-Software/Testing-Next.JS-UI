"use client";

import React from 'react';

interface HeaderProps {
  onInfoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onInfoClick }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-4xl flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-baseline">
            <h1 className="text-xl font-bold text-gray-700 mr-1">Cite Rite</h1>
            <span className="text-xs text-gray-500 mr-1 italic">by</span>
            <div className="font-semibold text-lg text-gray-700">
              GPT<span className="text-green-600">Zero</span>
            </div>
          </div>
          <div className="ml-2">
            <p className="text-xs text-gray-500">Preserve what's human</p>
          </div>
        </div>
        
        <button 
          onClick={onInfoClick}
          className="text-green-600 hover:text-green-800 flex items-center text-sm font-medium"
          aria-label="Information"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">How it works</span>
        </button>
      </div>
    </header>
  );
};

export default Header;