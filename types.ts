export interface NormalizationStats {
  total: number;
  success: number;
  skipped: number;
  skipReasons: Record<string, number>;
}

export interface FilingTrends {
  earliestYear: number;
  latestYear: number;
  totalYears: number;
  byYear: Array<{ year: number; count: number }>;
  peakYear: number;
  peakCount: number;
  avgPerYear: number;
}

export interface AssigneeStats {
  totalUniqueAssignees: number;
  topAssignees: Array<{ assignee: string; count: number }>;
}

export interface InventorStats {
  totalUniqueInventors: number;
  avgInventorsPerPatent: number;
  maxInventorsPerPatent: number;
  multiInventorPatents: number;
  topInventors: Array<{ name: string; count: number }>;
}

export interface TechnologyStats {
  totalUniqueCPCCodes: number;
  topCPCCodes: Array<{ code: string; count: number }>;
}

export interface CitationStats {
  totalCitations: number;
  avgCitationsPerPatent: number;
  maxCitations: number;
  mostCitedPatents: Array<{
    patentNumber: string;
    title: string;
    citationCount: number;
  }>;
}

export interface PatentStatistics {
  totalPatents: number;
  filingTrends: FilingTrends;
  assigneeStats: AssigneeStats;
  inventorStats: InventorStats;
  technologyStats: TechnologyStats;
  citationStats: CitationStats;
}
