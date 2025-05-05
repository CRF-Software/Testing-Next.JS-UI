export interface Citation {
  fulltext: string;
  link: string;
  summary: string;
  tags: string[];
}

export interface RelevantCitation {
  citation_id: string;
  snippet: string;
}

export interface Claim {
  start_index: number;
  end_index: number;
  claim_text: string;
  document_id: string;
  parent_claim_ids: string[];
  children_claim_ids: string[];
  relevant_citations: RelevantCitation[];
}

export interface ScanResult {
  document: {
    claims: {
      [key: string]: Claim;
    };
    citations: {
      [key: string]: Citation;
    };
  };
}
