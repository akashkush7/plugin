import {
  PluginBase,
  Bundle,
  OutputFormat,
  CSVParser,
  JSONParser,
  StatisticsHelper,
} from "@aganitha/report-framework";
import type { PatentRecord } from "./schemas.js";
import type { PatentStatistics } from "./types.js";
import { RecordNormalizer } from "./normalizer.js";
import { PatentsViewAPI } from "./api.js";

export default class PatentPlugin extends PluginBase {
  readonly id = "aganitha.patent-research";
  readonly version = "1.0.0";
  readonly name = "Patent Research";
  readonly description =
    "Patent analysis with inventor networks, technology trends, and assignee insights";

  readonly inputs = [
    {
      name: "filePath",
      label: "Data File Path",
      type: "file" as const,
      required: false,
      description: "Path to CSV or JSON file containing patent data",
    },
    {
      name: "keyword",
      label: "Search Keywords",
      type: "string" as const,
      required: false,
      description: "Search terms (e.g., artificial intelligence, CRISPR)",
    },
    // {
    //   name: "assignee",
    //   label: "Assignee/Organization",
    //   type: "string" as const,
    //   required: false,
    //   description: "Organization name (e.g., Google, MIT)",
    // },
    // {
    //   name: "inventor",
    //   label: "Inventor Name",
    //   type: "string" as const,
    //   required: false,
    //   description: "Inventor's last name",
    // },
    // {
    //   name: "cpcSubsection",
    //   label: "CPC Subsection",
    //   type: "string" as const,
    //   required: false,
    //   description: "CPC classification code (e.g., G06F for computing)",
    // },
    {
      name: "startDate",
      label: "Start Date",
      type: "string" as const,
      required: false,
      description:
        "Patent date start (YYYY-MM-DD format, defaults to 5 years ago)",
    },
    {
      name: "endDate",
      label: "End Date",
      type: "string" as const,
      required: false,
      description: "Patent date end (YYYY-MM-DD format, defaults to today)",
    },
    {
      name: "maxResults",
      label: "Max Results",
      type: "number" as const,
      required: false,
      description:
        "Maximum number of patents to fetch (default: 100, max: 10000)",
    },
  ];

  readonly outputFormats: OutputFormat[] = ["html", "pdf"];

  private normalizer = new RecordNormalizer();
  private api = new PatentsViewAPI();

  getSpecifications() {
    return {
      regular: {
        inputs: [
          { path: "samples.main", name: "records" },
          { path: "stats", name: "stats" },
        ],
        prompts: [
          {
            file: "summary.prompt.md",
            name: "summary_md",
            inputs: ["records", "stats"],
          },
          {
            file: "key-findings.prompt.md",
            name: "key_findings",
            inputs: ["records", "stats"],
          },
          {
            file: "technology-trends.prompt.md",
            name: "technology_trends",
            inputs: ["records", "stats"],
          },
          {
            file: "inventor-analysis.prompt.md",
            name: "inventor_analysis",
            inputs: ["records", "stats"],
          },
          {
            file: "assignee-insights.prompt.md",
            name: "assignee_insights",
            inputs: ["records", "stats"],
          },
          {
            file: "innovation-landscape.prompt.md",
            name: "innovation_landscape",
            inputs: ["records", "stats"],
          },
        ],
        template: { file: "report.mdx.njk", type: "mdx" as const },
      },
    };
  }

  getPromptsDir(): string {
    return "/shared/report-framework/plugins/patent/prompts";
  }

  getTemplatesDir(): string {
    return "/shared/report-framework/plugins/patent/templates";
  }

  protected validateInputs(inputs: Record<string, any>) {
    const hasFile =
      inputs.filePath &&
      typeof inputs.filePath === "string" &&
      inputs.filePath.trim();

    const hasKeyword =
      inputs.keyword &&
      typeof inputs.keyword === "string" &&
      inputs.keyword.trim();

    // Must have either file OR keyword (other fields are optional refinements)
    if (!hasFile && !hasKeyword) {
      return {
        valid: false,
        errors: [
          "Must provide either 'filePath' OR 'keyword' (assignee, inventor, and cpcSubsection are optional filters)",
        ],
      };
    }

    // Cannot use both file and API search
    if (hasFile && hasKeyword) {
      return {
        valid: false,
        errors: [
          "Cannot use both file upload and API search in the same request. Use either filePath OR keyword.",
        ],
      };
    }

    // Validate date format if provided
    if (inputs.startDate && !this.isValidDate(inputs.startDate)) {
      return {
        valid: false,
        errors: ["startDate must be in YYYY-MM-DD format"],
      };
    }

    if (inputs.endDate && !this.isValidDate(inputs.endDate)) {
      return {
        valid: false,
        errors: ["endDate must be in YYYY-MM-DD format"],
      };
    }

    return { valid: true };
  }

  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  protected async loadData(inputs: Record<string, any>): Promise<any[]> {
    const hasFile =
      inputs.filePath &&
      typeof inputs.filePath === "string" &&
      inputs.filePath.trim();

    if (hasFile) {
      const filePath = inputs.filePath.trim();
      const isJSON = filePath.endsWith(".json");

      if (isJSON) {
        return JSONParser.read(filePath);
      } else {
        return CSVParser.read(filePath);
      }
    } else {
      // Set default date range if not provided (last 5 years)
      const currentDate = new Date();
      const fiveYearsAgo = new Date(currentDate);
      fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);

      const inputsWithDefaults = {
        ...inputs,
        startDate: inputs.startDate || fiveYearsAgo.toISOString().split("T")[0],
        endDate: inputs.endDate || currentDate.toISOString().split("T")[0],
      };

      console.log(
        `📅 Date range: ${inputsWithDefaults.startDate} to ${inputsWithDefaults.endDate}`
      );

      return await this.api.fetchFromAPI(inputsWithDefaults);
    }
  }

  protected async transformData(
    data: any[],
    inputs: Record<string, any>
  ): Promise<PatentRecord[]> {
    const normalized = this.normalizer.normalize(data);
    return normalized.slice(0, 500);
  }

  protected async computeStatistics(
    data: PatentRecord[],
    inputs: Record<string, any>
  ): Promise<PatentStatistics> {
    return {
      totalPatents: data.length,
      filingTrends: this.calculateFilingTrends(data),
      assigneeStats: this.calculateAssigneeStats(data),
      inventorStats: this.calculateInventorStats(data),
      technologyStats: this.calculateTechnologyStats(data),
      citationStats: this.calculateCitationStats(data),
    };
  }

  protected async buildBundle(
    data: PatentRecord[],
    stats: PatentStatistics,
    inputs: Record<string, any>
  ): Promise<Bundle> {
    const hasFile =
      inputs.filePath &&
      typeof inputs.filePath === "string" &&
      inputs.filePath.trim();
    const dataSource = hasFile ? inputs.filePath : "PatentsView API Search";

    return {
      datasetName: "patent-research",
      samples: { main: data },
      stats,
      metadata: {
        totalRecords: data.length,
        ingestedAt: new Date().toISOString(),
        source: dataSource,
        searchParams: !hasFile
          ? {
              keyword: inputs.keyword,
              assignee: inputs.assignee,
              inventor: inputs.inventor,
              cpcSubsection: inputs.cpcSubsection,
              dateRange: {
                start: inputs.startDate,
                end: inputs.endDate,
              },
            }
          : null,
        pluginId: this.id,
        pluginVersion: this.version,
      },
    };
  }

  private calculateFilingTrends(records: PatentRecord[]) {
    const byYear = StatisticsHelper.countBy(records, (r) => r.patentYear);

    const years = Object.keys(byYear)
      .map(Number)
      .sort((a, b) => a - b);
    const earliest = years[0] || new Date().getFullYear();
    const latest = years[years.length - 1] || new Date().getFullYear();

    const byYearArray = years.map((year) => ({ year, count: byYear[year] }));
    const peakEntry = byYearArray.sort((a, b) => b.count - a.count)[0];

    return {
      earliestYear: earliest,
      latestYear: latest,
      totalYears: latest - earliest + 1,
      byYear: byYearArray,
      peakYear: peakEntry?.year || latest,
      peakCount: peakEntry?.count || 0,
      avgPerYear: records.length / (latest - earliest + 1 || 1),
    };
  }

  private calculateAssigneeStats(records: PatentRecord[]) {
    const topAssignees = StatisticsHelper.topN(
      records.map((r) => r.assignee),
      15
    );

    return {
      totalUniqueAssignees: new Set(records.map((r) => r.assignee)).size,
      topAssignees: topAssignees.map((t) => ({
        assignee: t.item,
        count: t.count,
      })),
    };
  }

  private calculateInventorStats(records: PatentRecord[]) {
    const allInventors = records.flatMap((r) => r.inventors);
    const topInventors = StatisticsHelper.topN(allInventors, 20);

    const totalInventors = allInventors.length;
    const multiInventorCount = records.filter(
      (r) => r.inventors.length > 1
    ).length;
    const maxInventors = Math.max(...records.map((r) => r.inventors.length), 0);

    return {
      totalUniqueInventors: new Set(allInventors).size,
      avgInventorsPerPatent: StatisticsHelper.average(
        records.map((r) => r.inventors.length)
      ),
      maxInventorsPerPatent: maxInventors,
      multiInventorPatents: multiInventorCount,
      topInventors: topInventors.map((t) => ({ name: t.item, count: t.count })),
    };
  }

  private calculateTechnologyStats(records: PatentRecord[]) {
    const allCPCCodes = records.flatMap((r) => r.cpcCodes);
    const topCPCCodes = StatisticsHelper.topN(allCPCCodes, 20);

    return {
      totalUniqueCPCCodes: new Set(allCPCCodes).size,
      topCPCCodes: topCPCCodes.map((t) => ({ code: t.item, count: t.count })),
    };
  }

  private calculateCitationStats(records: PatentRecord[]) {
    const citationCounts = records.map((r) => r.citationCount);
    const totalCitations = citationCounts.reduce((sum, c) => sum + c, 0);

    return {
      totalCitations,
      avgCitationsPerPatent: StatisticsHelper.average(citationCounts),
      maxCitations: Math.max(...citationCounts, 0),
      mostCitedPatents: records
        .sort((a, b) => b.citationCount - a.citationCount)
        .slice(0, 10)
        .map((r) => ({
          patentNumber: r.patentNumber,
          title: r.title,
          citationCount: r.citationCount,
        })),
    };
  }
}
