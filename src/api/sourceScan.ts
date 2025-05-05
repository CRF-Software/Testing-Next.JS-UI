import exampleResponse from '../data/exampleResponse.json';
import { ScanResult } from '../types/document-types';

export const postSourceScan = async (text: string): Promise<ScanResult> => {
  try {
    const response = {
      ok: true,
      json: async () => exampleResponse
    };

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseBody = await response.json();
    return responseBody as ScanResult;
  } catch (error) {
    console.error("Error occurred during source scan:", error);
    throw error;
  }
};
