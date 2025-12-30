# Patent Technology Trends Analysis

You are a technology analyst examining patent filing trends and technological evolution.

## Filing Trends Overview

- **Total Patents**: {{ stats.totalPatents }}
- **Time Period**: {{ stats.filingTrends.earliestYear }} to {{ stats.filingTrends.latestYear }} ({{ stats.filingTrends.totalYears }} years)
- **Peak Filing Year**: {{ stats.filingTrends.peakYear }} with {{ stats.filingTrends.peakCount }} patents
- **Average Patents per Year**: {{ stats.filingTrends.avgPerYear | round(1) }}

## Year-by-Year Filing Distribution

{% for year in stats.filingTrends.byYear %}
{{ year.year }}: {{ year.count }} patents
{% endfor %}

## Top Technology Classifications (CPC Codes)

{% for cpc in stats.technologyStats.topCPCCodes %}
{{ loop.index }}. {{ cpc.code }}: {{ cpc.count }} patents
{% endfor %}

## Sample Recent Patents (Technology Context)

{% for record in records %}
{% if loop.index <= 20 %}
**{{ record.patentNumber }}** - {{ record.title }} ({{ record.patentYear }})

- Assignee: {{ record.assignee }}
- CPC: {{ record.cpcCodes | join(', ') }}
- Citations: {{ record.citationCount }}
  {% endif %}
  {% endfor %}

## Task

Analyze the patent filing trends and provide a comprehensive technology trends analysis (400-500 words).

Your analysis should cover:

1. **Temporal Evolution**: How has patent filing activity changed over the years?

   - Identify growth phases, decline periods, or stable plateaus
   - Highlight the peak filing year and explain what it might indicate
   - Note any significant year-over-year changes

2. **Technology Shift Patterns**: What technology focus areas have emerged or declined?

   - Use CPC codes to identify dominant technology domains
   - Identify emerging technology areas (recent years) vs. mature areas
   - Note any shifts in technology priorities

3. **Innovation Cycles**: Are there discernible innovation waves or cycles?

   - Look for patterns in filing frequency
   - Identify potential technology maturation indicators
   - Note correlation between filing rates and specific technology areas

4. **Competitive Dynamics**: What do filing trends reveal about market competition?

   - Filing intensity in recent years
   - Technology diversification or specialization
   - Strategic positioning through patent portfolios

5. **Future Outlook**: Based on recent trends, what predictions can you make?
   - Extrapolate from the most recent 2-3 years
   - Identify technology areas likely to see increased activity
   - Note potential saturation points or declining areas

## Output Requirements

- Write in clear paragraphs with smooth transitions
- Include specific years, numbers, and percentages from the data
- Reference specific CPC technology areas
- Use analytical language: "indicates," "suggests," "reveals," "demonstrates"
- Support observations with quantitative evidence
- No bullet points - use flowing narrative prose

## Style

Professional technology trend analysis suitable for IP strategy reports, competitive intelligence, or technology forecasting.

Generate the technology trends analysis now based on the provided data.
