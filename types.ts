
export interface TechnicalInfo {
  ip: string;
  country: string;
  provider: string;
  status: 'online' | 'offline' | 'checking';
  protocol: 'HTTP' | 'HTTPS';
  location: string;
}

export interface AnalysisResult {
  summary: string;
  category: string;
  technical: TechnicalInfo;
  url: string;
  timestamp: number;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
}
