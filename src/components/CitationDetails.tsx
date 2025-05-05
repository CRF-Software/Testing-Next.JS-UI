import React from 'react';
import { Citation, Claim, RelevantCitation } from '../types/document-types';

interface CitationDetailsProps {
  claim: Claim | null;
  claimId: string | null;
  citations: Record<string, Citation>;
}

const CitationDetails: React.FC<CitationDetailsProps> = ({ claim, claimId, citations }) => {
  if (!claim || !claimId) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 h-full flex items-center justify-center">
        <p className="text-gray-500 text-center">
          Select a claim to view its citations
        </p>
      </div>
    );
  }

  const hasRelevantCitations = claim.relevant_citations.length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full overflow-auto">
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center mb-2">
          <h3 className="font-semibold text-lg text-gray-800">Claim</h3>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            ID: {claimId}
          </span>
        </div>
        <p className="text-gray-700">{claim.claim_text}</p>
      </div>

      {!hasRelevantCitations ? (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h4 className="font-medium text-yellow-700">Uncited Claim</h4>
          </div>
          <p className="mt-2 text-yellow-600 text-sm">
            This claim doesn't have any supporting citations. Consider reviewing it for accuracy.
          </p>
        </div>
      ) : (
        <>
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Supporting Citations</h3>
          {claim.relevant_citations.map((relevantCitation: RelevantCitation, index: number) => {
            const citation = citations[relevantCitation.citation_id];
            if (!citation) return null;
            
            return (
              <div key={index} className="mb-6 last:mb-0">
                <div className="bg-green-50 p-4 rounded-lg mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-green-800">
                        Citation Match
                      </h4>
                      <p className="mt-1 text-sm text-green-700">
                        {relevantCitation.snippet}
                      </p>
                    </div>
                    <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">
                      ID: {relevantCitation.citation_id}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {citation.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h5 className="font-medium text-gray-800 mb-1">Summary</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    {citation.summary}
                  </p>
                  
                  <a 
                    href={citation.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Source
                  </a>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default CitationDetails;
