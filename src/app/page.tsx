"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { postSourceScan } from "../api/sourceScan";
import mockInputs from "../constants/mockInputs";
import { ScanResult } from "../types/document-types";
import DocumentView from "../components/DocumentView";
import ClaimHierarchy from "../components/ClaimHierarchy";
import CitationDetails from "../components/CitationDetails";
import HelpModal from "../components/HelpModal";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sampleTextInput, setSampleTextInput] = useState<number>(0);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"claims" | "document">("claims");
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  const handleClickGo = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      if (!text) {
        setError("Text cannot be empty");
        setIsLoading(false);
        return;
      }
      
      const result = await postSourceScan(text);
      setScanResult(result);
      setSelectedClaimId(null);
    } catch (error) {
      console.error(error);
      setError("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickSampleText = () => {
    setText(mockInputs[sampleTextInput]);
    setSampleTextInput((sampleTextInput + 1) % mockInputs.length);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSelectClaim = (claimId: string) => {
    setSelectedClaimId(claimId);
  };

  // Initialize with sample text
  useEffect(() => {
    if (text === "" && mockInputs.length > 0) {
      setText(mockInputs[0]);
    }
  }, []);

  const selectedClaim = selectedClaimId && scanResult?.document.claims[selectedClaimId] || null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-10 max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
                More than an AI detector.
              </h1>
              <h2 className="text-4xl sm:text-5xl font-bold text-green-600 mb-6">
                Preserve what's human.
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                GPTZero researchers uncover the shortcomings of ChatGPT and major AI 
                models to ensure every word is worth reading.
              </p>
              
              <div className="flex flex-wrap gap-3 text-sm mb-8">
                <div className="bg-green-50 py-2 px-4 rounded-full text-green-800 font-medium">
                  <span className="mr-2 text-2xl font-bold">99%</span> Detection Accuracy
                </div>
                <div className="bg-blue-50 py-2 px-4 rounded-full text-blue-800 font-medium">
                  <span className="mr-2 text-2xl font-bold">9</span> million+ Users
                </div>
                <div className="bg-purple-50 py-2 px-4 rounded-full text-purple-800 font-medium">
                  <span className="mr-2 text-2xl font-bold">2500+</span> Organizations
                </div>
              </div>
              
              <button 
                onClick={() => document.getElementById('analyzeSection')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Start analyzing text
              </button>
            </div>
            
            <div className="flex-shrink-0 w-full md:w-auto flex justify-center">
              <div className="relative h-48 w-48 md:h-64 md:w-64">
                <div className="absolute inset-0 bg-green-600 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">GPT<span className="text-green-600">Zero</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text Analysis Section */}
      <div id="analyzeSection" className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Text Analysis</h2>
              <p className="text-gray-600">Enter text to analyze claims and citations</p>
            </div>
            
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How to use
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={handleClickSampleText} 
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Load Sample Text
              </button>
              
              {text && (
                <div className="text-gray-500 text-sm">
                  {text.length} characters
                </div>
              )}
            </div>
            
            <textarea
              className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800"
              placeholder="Enter text to analyze..."
              value={text}
              onChange={handleChange}
            />
            
            {error && (
              <div className="mt-2 text-red-500 text-sm">{error}</div>
            )}
            
            <button
              className={`mt-4 px-6 py-3 font-medium rounded-lg w-full flex items-center justify-center ${
                isLoading || !text
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
              onClick={handleClickGo}
              disabled={isLoading || !text}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                "Analyze Text"
              )}
            </button>
          </div>
        </div>

        {scanResult && (
          <div className="mb-8">
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`px-6 py-3 font-medium ${
                  activeView === "claims"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveView("claims")}
              >
                Claims Analysis
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeView === "document"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveView("document")}
              >
                Document View
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[700px] flex flex-col">
                {activeView === "claims" ? (
                  <ClaimHierarchy
                    claims={scanResult.document.claims}
                    citations={scanResult.document.citations}
                    selectedClaimId={selectedClaimId}
                    onSelectClaim={handleSelectClaim}
                  />
                ) : (
                  <DocumentView
                    text={text}
                    claims={scanResult.document.claims}
                    selectedClaimId={selectedClaimId}
                    onSelectClaim={handleSelectClaim}
                  />
                )}
              </div>
              
              <div className="h-[700px] flex flex-col">
                <CitationDetails
                  claim={selectedClaim}
                  claimId={selectedClaimId}
                  citations={scanResult.document.citations}
                />
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!scanResult && (
          <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Why choose GPTZero?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Accurate Detection</h3>
                <p className="text-gray-600">
                  Industry-leading AI detection with 99% accuracy on ChatGPT, Claude, and other major AI models.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Fast Results</h3>
                <p className="text-gray-600">
                  Get instant analysis with detailed breakdowns of claims and their supporting citations.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Privacy Focused</h3>
                <p className="text-gray-600">
                  Your data stays private. We never store or share your text submissions.
                </p>
              </div>
            </div>
          </div>
        )}

        <HelpModal
          isOpen={isHelpModalOpen}
          onClose={() => setIsHelpModalOpen(false)}
        />
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="font-semibold text-xl text-gray-700">
                GPT<span className="text-green-600">Zero</span>
              </div>
              <p className="text-sm text-gray-500">Preserve what's human</p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-gray-700">About</a>
              <a href="#" className="text-gray-500 hover:text-gray-700">Pricing</a>
              <a href="#" className="text-gray-500 hover:text-gray-700">Contact</a>
              <a href="#" className="text-gray-500 hover:text-gray-700">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-gray-700">Terms</a>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} GPTZero. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}