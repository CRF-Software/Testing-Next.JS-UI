"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { postSourceScan } from "../api/sourceScan";
import mockInputs from "../constants/mockInputs";
import { ScanResults } from "../components/ClaimViewer";
import Header from "../components/Header";

// Define types for the API response
interface Citation {
  fulltext: string;
  link: string;
  summary: string;
  tags: string[];
}

interface CitationReference {
  citation_id: string;
  snippet: string;
}

interface Claim {
  start_index: number;
  end_index: number;
  claim_text: string;
  document_id: string;
  parent_claim_ids: string[];
  children_claim_ids: string[];
  relevant_citations: CitationReference[];
}

interface ScanResultData {
  document: {
    claims: {
      [key: string]: Claim;
    };
    citations: {
      [key: string]: Citation;
    };
  };
}

export default function Home() {
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sampleTextInput, setSampleTextInput] = useState<number>(0);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);
  
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const handleInfoClick = () => {
    setShowHowItWorks(true);
    // Scroll to the how it works section with smooth behavior
    setTimeout(() => {
      howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleClickGo = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      if (!text) {
        setError("Text cannot be empty");
        setIsLoading(false);
        return;
      }
      
      const scanResultString = await postSourceScan(text);
      try {
        const parsedResult = JSON.parse(scanResultString) as ScanResultData;
        setScanResult(parsedResult);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        setError("Failed to parse the analysis results");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred during text analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickSampleText = () => {
    setText(mockInputs[sampleTextInput]);
    setSampleTextInput((sampleTextInput + 1) % mockInputs.length);
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <>
      <Header onInfoClick={handleInfoClick} />
      
      <div className="bg-gray-50 py-8 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Input */}
            <div className="lg:w-1/2">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Input Text</h2>
                <textarea
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Enter text to analyze claims and citations..."
                  value={text}
                  onChange={handleChange}
                />
                {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
                <div className="mt-4 flex justify-between items-center">
                  <button
                    className="text-green-600 hover:text-green-700 underline text-sm"
                    onClick={handleClickSampleText}
                  >
                    Use Sample Text
                  </button>
                  <button
                    className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    onClick={handleClickGo}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Text'}
                  </button>
                </div>
              </div>
              
              <div ref={howItWorksRef} className={`mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200 ${showHowItWorks ? 'ring-2 ring-green-500' : ''}`}>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 text-green-600 rounded-full flex items-center justify-center w-6 h-6 mt-0.5 mr-3">1</div>
                    <div>
                      <h3 className="font-medium text-gray-800">Extract Claims</h3>
                      <p className="text-gray-600 text-sm">Cite Rite identifies testable claims in your text.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 text-green-600 rounded-full flex items-center justify-center w-6 h-6 mt-0.5 mr-3">2</div>
                    <div>
                      <h3 className="font-medium text-gray-800">Find Citations</h3>
                      <p className="text-gray-600 text-sm">We search for supporting evidence for each claim.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 text-green-600 rounded-full flex items-center justify-center w-6 h-6 mt-0.5 mr-3">3</div>
                    <div>
                      <h3 className="font-medium text-gray-800">Map Relationships</h3>
                      <p className="text-gray-600 text-sm">See how claims relate to each other in a logical hierarchy.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Results */}
            <div className="lg:w-1/2">
              {isLoading ? (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                  <p className="text-gray-500 mt-4">Analyzing your text...</p>
                </div>
              ) : scanResult ? (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Claim Analysis Results</h2>
                  <ScanResults scanData={scanResult} />
                </div>
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center h-64">
                  <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 mt-4">Enter text and click "Analyze Text" to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}