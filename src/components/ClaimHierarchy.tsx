import React from 'react';
import ClaimComponent from './ClaimComponent';
import { Claim, Citation } from '../types/document-types';

interface ClaimHierarchyProps {
  claims: Record<string, Claim>;
  citations: Record<string, Citation>;
  selectedClaimId: string | null;
  onSelectClaim: (claimId: string) => void;
}

const ClaimHierarchy: React.FC<ClaimHierarchyProps> = ({
  claims,
  citations,
  selectedClaimId,
  onSelectClaim
}) => {
  // Find root claims (claims without parent)
  const rootClaims = Object.entries(claims)
    .filter(([_, claim]) => claim.parent_claim_ids.length === 0)
    .map(([id, claim]) => ({ id, claim }))
    .sort((a, b) => a.claim.start_index - b.claim.start_index);

  // Count claims with citations
  const citedClaimsCount = Object.values(claims).filter(
    claim => claim.relevant_citations.length > 0
  ).length;

  // Total claims count
  const totalClaimsCount = Object.keys(claims).length;
  
  // Citation coverage percentage
  const coveragePercentage = Math.round((citedClaimsCount / totalClaimsCount) * 100);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-auto">
      <div className="p-6 border-b border-gray-200">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">
          Claims Analysis
        </h3>
        
        <div className="grid grid-cols-3 gap-4 mb-2">
          <div className="bg-gray-50 rounded p-3">
            <div className="text-2xl font-bold text-gray-800">{totalClaimsCount}</div>
            <div className="text-sm text-gray-600">Total Claims</div>
          </div>
          
          <div className="bg-green-50 rounded p-3">
            <div className="text-2xl font-bold text-green-600">{citedClaimsCount}</div>
            <div className="text-sm text-gray-600">Cited Claims</div>
          </div>
          
          <div className="bg-blue-50 rounded p-3">
            <div className="text-2xl font-bold text-blue-600">{coveragePercentage}%</div>
            <div className="text-sm text-gray-600">Citation Coverage</div>
          </div>
        </div>

        <div className="text-sm text-gray-600 mt-4">
          Click on any claim to view its citations. Claims with a green border have supporting citations.
        </div>
      </div>
      
      <div className="p-6">
        <h4 className="font-medium text-gray-700 mb-4">Main Claims</h4>
        {rootClaims.map(({ id, claim }) => (
          <ClaimComponent
            key={id}
            claim={claim}
            claimId={id}
            citations={citations}
            allClaims={claims}
            isSelected={selectedClaimId === id}
            onSelectClaim={onSelectClaim}
          />
        ))}
      </div>
    </div>
  );
};

export default ClaimHierarchy;
