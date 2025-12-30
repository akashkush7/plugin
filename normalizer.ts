import { PatentRecordSchema } from "./schemas.js";
import type { PatentRecord } from "./schemas.js";
import type { NormalizationStats } from "./types.js";

export class RecordNormalizer {
  normalize(rawData: any[]): PatentRecord[] {
    const stats: NormalizationStats = {
      total: rawData.length,
      success: 0,
      skipped: 0,
      skipReasons: {},
    };

    const normalized: PatentRecord[] = [];

    for (const raw of rawData) {
      try {
        const record = this.normalizePatent(raw);
        const validation = PatentRecordSchema.safeParse(record);

        if (validation.success) {
          normalized.push(validation.data);
          stats.success++;
        } else {
          this.recordSkip(stats, "validation_failed");
        }
      } catch (error) {
        this.recordSkip(
          stats,
          error instanceof Error ? error.message : "unknown_error"
        );
      }
    }

    console.log(`\n📊 Normalization Summary:`);
    console.log(`   Total: ${stats.total}`);
    console.log(`   ✓ Success: ${stats.success}`);
    console.log(`   ✗ Skipped: ${stats.skipped}`);

    if (stats.skipped > 0) {
      console.log(`   Skip Reasons:`);
      for (const [reason, count] of Object.entries(stats.skipReasons)) {
        console.log(`     - ${reason}: ${count}`);
      }
    }

    return normalized;
  }

  private normalizePatent(raw: any): PatentRecord {
    // Extract inventors
    const inventors = Array.isArray(raw.inventors)
      ? raw.inventors.map((inv: any) => {
          const firstName = inv.inventor_first_name || "";
          const lastName = inv.inventor_last_name || "";
          return `${firstName} ${lastName}`.trim();
        })
      : [];

    // Extract assignee (take first one)
    const assignee =
      Array.isArray(raw.assignees) && raw.assignees.length > 0
        ? raw.assignees[0].assignee_organization || "Unknown Assignee"
        : "Unknown Assignee";

    // Extract CPC codes and titles
    const cpcCodes: string[] = [];
    const cpcTitles: string[] = [];
    if (Array.isArray(raw.cpc_subgroup_id)) {
      cpcCodes.push(...raw.cpc_subgroup_id);
    }
    if (Array.isArray(raw.cpc_subgroup_title)) {
      cpcTitles.push(...raw.cpc_subgroup_title);
    }

    // Parse patent date
    const patentDate = raw.patent_date || "";
    const patentYear = patentDate
      ? parseInt(patentDate.split("-")[0], 10)
      : new Date().getFullYear();

    return {
      patentNumber: raw.patent_number || "",
      title: raw.patent_title || "Untitled",
      abstract: raw.patent_abstract || "No abstract available",
      inventors,
      assignee,
      patentDate,
      patentYear,
      patentType: raw.patent_type || "",
      cpcCodes,
      cpcTitles,
      citationCount: raw.cited_patent_count || 0,
      citedByCount: raw.citedby_patent_count || 0,
    };
  }

  private recordSkip(stats: NormalizationStats, reason: string) {
    stats.skipped++;
    stats.skipReasons[reason] = (stats.skipReasons[reason] || 0) + 1;
  }
}
