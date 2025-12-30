import { HttpClient } from "@aganitha/report-framework";

export class PatentsViewAPI {
  private readonly baseUrl = "https://search.patentsview.org/api/v1/patent/";
  private readonly apiKey = "c5G1PMZv.LA88sxC8oIRHRgN585ejIXmp5JLL9izE";

  async fetchFromAPI(inputs: Record<string, any>): Promise<any[]> {
    const maxResults =
      typeof inputs.maxResults === "number" ? inputs.maxResults : 100;

    console.log(`🔎 Searching PatentsView API...`);
    console.log(`📋 Search criteria:`, {
      keyword: inputs.keyword || "(none)",
      dateRange: `${inputs.startDate} to ${inputs.endDate}`,
      maxResults,
    });

    if (!this.apiKey) {
      console.warn(
        "⚠️  PATENTSVIEW_API_KEY not found in environment variables"
      );
      return [];
    }

    const patents = await this.searchPatents(inputs, maxResults);

    if (patents.length === 0) {
      console.log("⚠️  No patents found");
      return [];
    }

    console.log(`✓ Found ${patents.length} patents`);
    return patents;
  }

  private async searchPatents(
    inputs: Record<string, any>,
    maxResults: number
  ): Promise<any[]> {
    try {
      const query = this.buildQuery(inputs);
      const fields = this.getFields();
      const sort = [{ patent_date: "desc" }, { patent_id: "asc" }];

      const allPatents: any[] = [];
      let after: any = undefined;
      const batchSize = Math.min(maxResults, 1000);

      while (allPatents.length < maxResults) {
        const remainingSize = Math.min(
          batchSize,
          maxResults - allPatents.length
        );

        const requestBody: any = {
          q: query,
          f: fields,
          s: sort,
          o: { size: remainingSize },
        };

        if (after) {
          requestBody.o.after = after;
        }

        console.log(`📥 Fetching batch (up to ${remainingSize} patents)...`);

        await HttpClient.sleep(1400);

        const response = await HttpClient.fetchWithRetry(this.baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": this.apiKey,
          },
          body: JSON.stringify(requestBody),
          timeout: 30000,
          retries: 3,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`❌ HTTP ${response.status}: ${response.statusText}`);
          console.warn(`❌ Response:`, errorText);
          break;
        }

        const data = await response.json();

        if (data.error) {
          console.error("❌ API error:", JSON.stringify(data, null, 2));
          break;
        }

        const patents = data.patents || [];

        if (patents.length === 0) {
          console.log("✓ No more results");
          break;
        }

        allPatents.push(...patents);
        console.log(
          `  ✓ Got ${patents.length} patents (total: ${allPatents.length}/${
            data.total_hits || 0
          })`
        );

        if (
          allPatents.length >= maxResults ||
          allPatents.length >= (data.total_hits || 0)
        ) {
          break;
        }

        if (patents.length === remainingSize) {
          const last = patents[patents.length - 1];
          after = [last.patent_date, last.patent_id];
        } else {
          break;
        }
      }

      return allPatents.slice(0, maxResults);
    } catch (error) {
      const err = error as Error;
      console.error(`❌ PatentsView API error: ${err.message}`);
      return [];
    }
  }

  private buildQuery(inputs: Record<string, any>): any {
    const conditions: any[] = [];

    // Date range filters
    if (inputs.startDate) {
      conditions.push({ _gte: { patent_date: inputs.startDate } });
    }

    if (inputs.endDate) {
      conditions.push({ _lte: { patent_date: inputs.endDate } });
    }

    // Patent type filter
    conditions.push({ patent_type: "utility" });

    // Keyword filter using text phrase matching
    if (inputs.keyword && typeof inputs.keyword === "string") {
      const keyword = inputs.keyword.trim();
      conditions.push({
        _text_phrase: { patent_title: keyword },
      });
    }

    if (conditions.length === 1) {
      return conditions[0];
    }

    return { _and: conditions };
  }

  private getFields(): string[] {
    return [
      "patent_id",
      "patent_title",
      "patent_abstract",
      "patent_date",
      "patent_year",
      "patent_type",
      "patent_num_us_patents_cited",
      "patent_num_times_cited_by_us_patents",
      "assignees",
      "inventors",
      "cpc_current",
    ];
  }
}
