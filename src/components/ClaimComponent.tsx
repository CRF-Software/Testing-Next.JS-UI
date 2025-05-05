import React, { useState } from 'react';
import { Claim, Citation } from '../types/document-types';

interface ClaimProps {
  claim: Claim;
  claimId: string;
  citations: Record<string, Citation>;
  allClaims: Record<string, Claim>;
  isChildClaim?: boolean;
  isSelected?: boolean;
  onSelectClaim: (claimId: string) => void;
}

const ClaimComponent: React.FC<ClaimProps> = ({
  claim,
  claimId,
  citations,
  allClaims,
  isChildClaim = false,
  isSelected = false,
  onSelectClaim
}) => {
  const [showChildren, setShowChildren] = useState(false);
  
  const hasCitations = claim.relevant_citations.length > 0;
  const hasChildren = claim.children_claim_ids.length > 0;
  
  return (
    <div 
      className={`border rounded-lg p-4 mb-2 transition-all ${
        isChildClaim ? 'ml-6 border-gray-300' : 'border-gray-400'
      } ${
        isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-50'
      } ${
        hasCitations ? 'border-l-4 border-l-green-500' : ''
      }`}
      onClick={() => onSelectClaim(claimId)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-800">{claim.claim_text}</p>
          
          {hasChildren && (
            <button
              className="mt-2 text-sm text-blue-600 flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                setShowChildren(!showChildren);
              }}
            >
              {showChildren ? '? Hide supporting claims' : '? Show supporting claims'} 
              <span className="ml-1 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {claim.children_claim_ids.length}
              </span>
            </button>
          )}
        </div>
        
        {hasCitations && (
          <div className="ml-2 flex-shrink-0">
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cited
            </span>
          </div>
        )}
      </div>

      {showChildren && claim.children_claim_ids.length > 0 && (
        <div className="mt-3">
          {claim.children_claim_ids.map((childId) => (
            <ClaimComponent
              key={childId}
              claim={allClaims[childId]}
              claimId={childId}
              citations={citations}
              allClaims={allClaims}
              isChildClaim={true}
              isSelected={isSelected && childId === claimId}
              onSelectClaim={onSelectClaim}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimComponent;
