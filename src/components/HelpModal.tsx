import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">How to Use Cite Rite</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Introduction</h3>
            <p className="text-gray-600">
              Cite Rite helps you analyze texts to identify claims and their supporting citations.
              It breaks down a document into testable claims and searches for evidence to back them up.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Key Features</h3>
            <ul className="list-disc ml-5 space-y-2 text-gray-600">
              <li>
                <strong>Claims Analysis:</strong> Texts are broken down into logical statements (claims).
              </li>
              <li>
                <strong>Citation Matching:</strong> Claims are matched with relevant citations from reputable sources.
              </li>
              <li>
                <strong>Hierarchical View:</strong> Claims are organized in a parent-child relationship to show logical dependencies.
              </li>
              <li>
                <strong>Source Verification:</strong> Each citation includes links to original sources for verification.
              </li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How to Use the Interface</h3>
            <ol className="list-decimal ml-5 space-y-3 text-gray-600">
              <li>
                <strong>Input text:</strong> Enter or paste your text in the input field, or use the "Sample Text" button.
              </li>
              <li>
                <strong>Analyze:</strong> Click the "Go" button to process the text and identify claims and citations.
              </li>
              <li>
                <strong>Explore claims:</strong> 
                <ul className="list-disc ml-5 mt-1">
                  <li>Claims with a green border have supporting citations.</li>
                  <li>Click on a claim to view its citations in the right panel.</li>
                  <li>Click "Show supporting claims" to see related child claims.</li>
                </ul>
              </li>
              <li>
                <strong>Read document view:</strong> The document view highlights all claims in the original text.
              </li>
              <li>
                <strong>Verify sources:</strong> Click "View Source" links to access the original citation sources.
              </li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Understanding the Results</h3>
            <ul className="list-disc ml-5 space-y-2 text-gray-600">
              <li>
                <strong>Citation coverage:</strong> The percentage of claims that have supporting citations.
              </li>
              <li>
                <strong>Source quality:</strong> Citations are tagged by source type (e.g., Academic, Blog, Government).
              </li>
              <li>
                <strong>Claim relationships:</strong> Parent claims represent broader statements, while child claims offer supporting details.
              </li>
            </ul>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
