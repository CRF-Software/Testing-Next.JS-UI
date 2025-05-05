import React from 'react';
import { AnalyticsData } from '@/types';

// Simple progress bar component
const ProgressBar = ({ percentage }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const AnalyticsPanel = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Analysis Summary</h3>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600">Claim Analysis</h4>
          <p className="text-2xl font-bold text-gray-800">{data.totalClaims} Claims</p>
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Cited</span>
              <span className="text-gray-800 font-medium">{data.citationPercentage}%</span>
            </div>
            <ProgressBar percentage={data.citationPercentage} />
            
            <div className="mt-3 flex justify-between text-xs">
              <span className="text-green-600">{data.citedClaims} Cited</span>
              <span className="text-red-600">{data.uncitedClaims} Uncited</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-600">Citation Sources</h4>
          <p className="text-2xl font-bold text-gray-800">{data.sourcesCount} Sources</p>
          
          <div className="mt-3 space-y-2">
            {Object.entries(data.sourceTypes).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-xs text-gray-600">{type}</span>
                <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
