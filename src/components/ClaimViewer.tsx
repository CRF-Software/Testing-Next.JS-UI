"use client";

import React, { useState } from 'react';

// Types
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

interface ClaimNodeProps {
  claim: Claim;
  claims: { [key: string]: Claim };
  citations: { [key: string]: Citation };
  level: number;
}

interface CitationCardProps {
  citation: CitationReference;
  fullCitation: Citation;
}

interface ScanResultsProps {
  scanData: ScanResultData | null;
}

// Components for displaying scan results
export const ScanResults: React.FC<ScanResultsProps> = ({ scanData }: ScanResultsProps) => {
  if (!scanData || !scanData.document) return null;
  
  const { claims, citations } = scanData.document;
  
  if (!claims || !citations) return null;
  
  // Find root level claims
  const rootClaims = Object.keys(claims).filter(
    id => !claims[id].parent_claim_ids || !Array.isArray(claims[id].parent_claim_ids) || claims[id].parent_claim_ids.length === 0
  );
  
  return (
    <div className="space-y-6">
      {rootClaims.map(claimId => (
        <ClaimNode 
          key={claimId}
          claim={claims[claimId]} 
          claims={claims} 
          citations={citations}
          level={0}
        />
      ))}
    </div>
  );
};

// Component to display a single claim and its children recursively
const ClaimNode: React.FC<ClaimNodeProps> = ({ claim, claims, citations, level }: ClaimNodeProps) => {
  const [expanded, setExpanded] = useState(true);
  const [showCitations, setShowCitations] = useState(false);
  
  // Check if this claim has citations
  const hasCitations = claim.relevant_citations && Array.isArray(claim.relevant_citations) && claim.relevant_citations.length > 0;
  
  // Check if this claim has children
  const hasChildren = claim.children_claim_ids && Array.isArray(claim.children_claim_ids) && claim.children_claim_ids.length > 0;
  
  // Calculate left margin based on level
  const marginLeft = level > 0 ? `${level * 20}px` : '0';
  
  return (
    <div style={{ marginLeft }} className={`${level > 0 ? 'border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className={`p-4 rounded-lg ${hasCitations ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start">
              {hasChildren && (
                <button 
                  onClick={() => setExpanded(!expanded)}
                  className="mr-3 text-gray-500 hover:text-gray-700 focus:outline-none mt-1"
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-white rounded border border-gray-200">
                    {expanded ? '-' : '+'}
                  </span>
                </button>
              )}
              <p className="text-gray-800">{claim.claim_text}</p>
            </div>
            
            {hasCitations && (
              <div className="mt-3 ml-8">
                <button 
                  onClick={() => setShowCitations(!showCitations)}
                  className="text-sm text-green-600 hover:text-green-700 focus:outline-none flex items-center"
                >
                  {showCitations ? 'Hide citations' : 'Show citations'} 
                  <span className="ml-2 bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                    {claim.relevant_citations.length}
                  </span>
                </button>
                
                {showCitations && (
                  <div className="mt-3 space-y-3">
                    {claim.relevant_citations.map((citation: CitationReference, index: number) => {
                      const fullCitation = citations[citation.citation_id];
                      if (!fullCitation) return null;
                      
                      return <CitationCard key={index} citation={citation} fullCitation={fullCitation} />;
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Render children claims if expanded */}
      {expanded && hasChildren && (
        <div className="mt-3 mb-3 space-y-3">
          {claim.children_claim_ids.map(childId => (
            claims[childId] ? (
              <ClaimNode 
                key={childId}
                claim={claims[childId]} 
                claims={claims} 
                citations={citations}
                level={level + 1}
              />
            ) : null
          ))}
        </div>
      )}
    </div>
  );
};

// Component for a single citation
const CitationCard: React.FC<CitationCardProps> = ({ citation, fullCitation }: CitationCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {fullCitation.tags && Array.isArray(fullCitation.tags) && fullCitation.tags.map((tag: string, i: number) => (
            <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        
        <p className="text-gray-800 text-sm mb-3">
          <span className="font-medium">Cited text: </span>
          {citation.snippet || "No snippet available"}
        </p>
        
        <div className="flex justify-between items-center">
          {fullCitation.link && (
            <a 
              href={fullCitation.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 text-sm underline"
            >
              View Source
            </a>
          )}
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-gray-500 hover:text-gray-700 focus:outline-none flex items-center"
          >
            {expanded ? 'Show less' : 'Show more'}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          <p className="text-gray-600 text-sm mb-3">
            <span className="font-medium">Summary: </span>
            {fullCitation.summary}
          </p>
          <div className="bg-white p-3 rounded border border-gray-200 mt-3 text-xs text-gray-600 max-h-32 overflow-y-auto">
            <p className="whitespace-pre-line">{fullCitation.fulltext.substring(0, 300)}...</p>
          </div>
        </div>
      )}
    </div>
  );
};
