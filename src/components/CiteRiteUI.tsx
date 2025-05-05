// First, update the CiteRiteUIProps interface to match the ScanResult type
interface CiteRiteUIProps {
  scanResult: ScanResult;  // Changed from 'any' to 'ScanResult'
}

// The rest of your CiteRiteUI component remains the same
const CiteRiteUI: React.FC<CiteRiteUIProps> = ({ scanResult }) => {
  const [activeClaim, setActiveClaim] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'list' | 'tree'>('list');

  if (!scanResult) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-600">No scan result available. Please scan a document first.</p>
      </div>
    );
  }

  const { claims, citations } = scanResult.document;
  // Rest of the component remains unchanged...
}