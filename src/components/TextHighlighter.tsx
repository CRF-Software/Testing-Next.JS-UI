import React from 'react';
import { ClaimWithId } from '@/types';

interface TextHighlighterProps {
  text: string;
  claims: ClaimWithId[];
  selectedClaimId: string | null;
  onClaimClick: (claimId: string) => void;
}

const TextHighlighter: React.FC<TextHighlighterProps> = ({ 
  text, 
  claims, 
  selectedClaimId,
  onClaimClick 
}) => {
  // Sort claims by start_index to properly build the highlighted text
  const sortedClaims = [...claims].sort((a, b) => a.start_index - b.start_index);
  
  // Build an array of text segments with highlighting information
  const buildHighlightedSegments = () => {
    const segments = [];
    let lastIndex = 0;
    
    sortedClaims.forEach(claim => {
      // Add non-highlighted text before this claim
      if (claim.start_index > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, claim.start_index),
          isClaim: false,
          claimId: null
        });
      }
      
      // Add the highlighted claim text
      segments.push({
        text: text.substring(claim.start_index, claim.end_index),
        isClaim: true,
        claimId: claim.id,
        isSelected: claim.id === selectedClaimId,
        hasCitations: claim.relevant_citations && claim.relevant_citations.length > 0
      });
      
      lastIndex = claim.end_index;
    });
    
    // Add any remaining text after the last claim
    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        isClaim: false,
        claimId: null
      });
    }
    
    return segments;
  };
  
  const segments = buildHighlightedSegments();
  
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm text-gray-800 whitespace-pre-wrap">
      {segments.map((segment, index) => {
        if (!segment.isClaim) {
          return <span key={index}>{segment.text}</span>;
        }
        
        let bgColor = segment.hasCitations ? 'bg-green-100' : 'bg-red-100';
        if (segment.isSelected) {
          bgColor = segment.hasCitations ? 'bg-green-200' : 'bg-red-200';
        }
        
        return (
          <span 
            key={index}
            className={`cursor-pointer ${bgColor} px-0.5 py-0.5 rounded transition-colors duration-200`}
            onClick={() => onClaimClick(segment.claimId!)}
          >
            {segment.text}
          </span>
        );
      })}
    </div>
  );
};

export default TextHighlighter;
