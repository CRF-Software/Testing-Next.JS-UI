import React from 'react';

interface HelpPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpPopup: React.FC<HelpPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-gray-800">How to Use Cite Rite</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-4 space-y-4 text-gray-600">
            <section>
              <h3 className="font-medium text-gray-800 mb-2">Getting Started</h3>
              <p>
                Cite Rite analyzes your text to identify claims and finds relevant citations for these claims.
                You can either enter your own text or use one of our sample texts to get started.
              </p>
            </section>
            
            <section>
              <h3 className="font-medium text-gray-800 mb-2">Understanding the Results</h3>
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Text View</h4>
                  <p className="text-sm">
                    In the text view, claims are highlighted in different colors:
                  </p>
                  <ul className="list-disc pl-5 text-sm mt-1">
                    <li><span className="bg-green-100 px-1 rounded">Green highlights</span> indicate claims that have supporting citations.</li>
                    <li><span className="bg-red-100 px-1 rounded">Red highlights</span> indicate claims without citations.</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Claims Panel</h4>
                  <p className="text-sm">
                    The claims panel lists all identified claims in your text. 
                    Click on any claim to see its details, including:
                  </p>
                  <ul className="list-disc pl-5 text-sm mt-1">
                    <li>Supporting citations with source information</li>
                    <li>Relationships to other claims (parent and child claims)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Analytics Dashboard</h4>
                  <p className="text-sm">
                    The analytics dashboard provides an overview of your document's claims:
                  </p>
                  <ul className="list-disc pl-5 text-sm mt-1">
                    <li>Total number of claims identified</li>
                    <li>Percentage of claims with supporting citations</li>
                    <li>Number and types of citation sources</li>
                  </ul>
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="font-medium text-gray-800 mb-2">Claim Relationships</h3>
              <p className="text-sm">
                Claims can have parent-child relationships:
              </p>
              <ul className="list-disc pl-5 text-sm mt-1">
                <li><strong>Parent claims</strong> are broader statements that are supported by the current claim.</li>
                <li><strong>Child claims</strong> are more specific statements that provide support for the current claim.</li>
              </ul>
            </section>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-200"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPopup;
