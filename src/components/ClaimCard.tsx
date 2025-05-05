import React, { useState } from 'react';
import { ClaimWithId, CitationWithId } from '@/types';

interface ClaimCardProps {
  claim: ClaimWithId;
  citations: { [key: string]: CitationWithId };
  isSelected: boolean;
  onSelect: (claimId: string) => void;
  parentClaims: ClaimWithId[];
  childrenClaims: ClaimWithId[];
}

const ClaimCard: React.FC<ClaimCardProps> = ({ 
  claim, 
  citations, 
  isSelected, 
  onSelect,
  parentClaims,
  childrenClaims
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasCitations = claim.relevant_citations && claim.relevant_citations.length > 0;
  const hasRelationships = parentClaims.length > 0 || childrenClaims.length > 0;
  
  const citationBadgeClass = hasCitations 
    ? "bg-green-100 text-green-800 border-green-200" 
    : "bg-red-100 text-red-800 border-red-200";

  return (
    <div 
      className={`mb-4 rounded-lg border p-4 shadow-sm transition-all duration-300 ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:bg-gray-50"
      }`}
      onClick={() => onSelect(claim.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${citationBadgeClass}`}>
              {hasCitations ? "Cited" : "Uncited"}
            </span>
            {hasRelationships && (
              <span className="text-xs font-medium px-2 py-1 rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                Has Relationships
              </span>
            )}
          </div>
          <p className="text-gray-800">{claim.claim_text}</p>
        </div>
      </div>
      
      {isSelected && (
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-900">Citation Information</h4>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          </div>
          
          {hasCitations ? (
            <div className="space-y-3">
              {claim.relevant_citations.map((citation, index) => {
                const fullCitation = citations[citation.citation_id];
                return (
                  <div key={index} className="rounded-md bg-gray-50 p-3">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {fullCitation?.tags?.map((tag, i) => (
                            <span key={i} className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{citation.snippet}</p>
                        {isExpanded && fullCitation && (
                          <div className="mt-2 border-t border-gray-200 pt-2">
                            <p className="text-xs text-gray-500 mt-1 line-clamp-3">{fullCitation.summary}</p>
                            <a 
                              href={fullCitation.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="mt-2 text-xs text-blue-600 hover:underline inline-block"
                            >
                              View Source
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No citations found for this claim.</p>
          )}

          {hasRelationships && isExpanded && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Claim Relationships</h4>
              
              {parentClaims.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-sm font-medium text-gray-700">Parent Claims:</h5>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parentClaims.map(parent => (
                      <li key={parent.id} className="text-sm text-gray-600">
                        {parent.claim_text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {childrenClaims.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700">Child Claims:</h5>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {childrenClaims.map(child => (
                      <li key={child.id} className="text-sm text-gray-600">
                        {child.claim_text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClaimCard;
