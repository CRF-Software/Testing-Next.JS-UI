"use client";

import React, { useState, useEffect } from "react";
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
    <main className="container mx-auto px-4 py-8">
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
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
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
                : "bg-blue-600 text-white hover:bg-blue-700"
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
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveView("claims")}
            >
              Claims Analysis
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeView === "document"
                  ? "border-b-2 border-blue-600 text-blue-600"
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

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </main>
  );
}
