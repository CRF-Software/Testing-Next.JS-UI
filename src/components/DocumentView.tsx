import React, { useMemo } from 'react';
import { Claim } from '../types/document-types';

interface DocumentViewProps {
  text: string;
  claims: Record<string, Claim>;
  selectedClaimId: string | null;
  onSelectClaim: (claimId: string) => void;
}

const DocumentView: React.FC<DocumentViewProps> = ({
  text,
  claims,
  selectedClaimId,
  onSelectClaim
}) => {
  // Sort claims by their starting position
  const sortedClaims = useMemo(() => {
    return Object.entries(claims)
      .map(([id, claim]) => ({ id, ...claim }))
      .sort((a, b) => a.start_index - b.start_index);
  }, [claims]);

  // Build segments from the original text
  const segments = useMemo(() => {
    const segments: Array<{
      text: string;
      isHighlighted: boolean;
      claimId?: string;
      hasCitations: boolean;
    }> = [];

    let lastIndex = 0;

    sortedClaims.forEach(({ id, start_index, end_index, relevant_citations }) => {
      // Add text before the claim
      if (start_index > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, start_index),
          isHighlighted: false,
          hasCitations: false
        });
      }

      // Add the claim
      segments.push({
        text: text.substring(start_index, end_index),
        isHighlighted: true,
        claimId: id,
        hasCitations: relevant_citations.length > 0
      });

      lastIndex = end_index;
    });

    // Add any remaining text
    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        isHighlighted: false,
        hasCitations: false
      });
    }

    return segments;
  }, [text, sortedClaims]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 overflow-auto">
      <h3 className="font-semibold text-lg text-gray-800 mb-4">
        Document Text
      </h3>
      <div className="prose max-w-none">
        {segments.map((segment, index) => {
          if (!segment.isHighlighted) {
            return <span key={index}>{segment.text}</span>;
          }

          const isSelected = selectedClaimId === segment.claimId;
          
          return (
            <span
              key={index}
              className={`
                cursor-pointer 
                px-0.5 
                rounded
                ${isSelected ? 'bg-blue-200' : 'bg-blue-50'}
                ${segment.hasCitations ? 'border-b-2 border-green-500' : ''}
              `}
              onClick={() => segment.claimId && onSelectClaim(segment.claimId)}
            >
              {segment.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentView;
