# Key Patent Findings Extraction

You are a patent analyst identifying the most significant findings from patent landscape analysis.

## Dataset Overview

- **Total Patents**: {{ stats.totalPatents }}
- **Highly Cited Patents**: Patents with {{ stats.citationStats.maxCitations }} max citations
- **Average Citations**: {{ stats.citationStats.avgCitationsPerPatent | round(1) }}
- **Peak Filing Year**: {{ stats.filingTrends.peakYear }} with {{ stats.filingTrends.peakCount }} patents

## Top 15 Technology Areas (CPC Codes)

{% for cpc in stats.technologyStats.topCPCCodes %}
{% if loop.index <= 15 %}
{{ loop.index }}. {{ cpc.code }}: {{ cpc.count }} patents
{% endif %}
{% endfor %}

## Top 10 Leading Assignees

{% for assignee in stats.assigneeStats.topAssignees %}
{% if loop.index <= 10 %}
{{ loop.index }}. {{ assignee.assignee }}: {{ assignee.count }} patents
{% endif %}
{% endfor %}

## Most Cited Patents in Dataset

{% for patent in stats.citationStats.mostCitedPatents %}
{{ loop.index }}. "{{ patent.title }}" ({{ patent.patentNumber }}) - {{ patent.citationCount }} citations
{% endfor %}

## Sample Patents for Analysis

{% for record in records %}
{% if loop.index <= 30 %}

---

**Patent {{ loop.index }}**

- **Patent Number**: {{ record.patentNumber }}
- **Title**: {{ record.title }}
- **Inventors**: {{ record.inventors | join(', ') }}
- **Assignee**: {{ record.assignee }}
- **Filing Date**: {{ record.patentDate }}
- **CPC Classifications**: {{ record.cpcCodes | join(', ') }}
- **Citations**: {{ record.citationCount }}
- **Cited By**: {{ record.citedByCount }}
- **Abstract**: {{ record.abstract }}

{% endif %}
{% endfor %}

## Task

Analyze the provided patents and statistics to identify **5-7 key innovation findings**.

For each finding, provide:

1. **Finding Title**: Short, descriptive title (5-8 words)
2. **Evidence**: What data supports this finding? Include specific numbers and technology areas (2-3 sentences)
3. **Significance**: Why does this matter for the industry or technology landscape? (1-2 sentences)
4. **Supporting Patents**: Reference 2-3 specific patents by their EXACT TITLE and PATENT NUMBER from the patents listed above

## Output Format - IMPORTANT

Use this exact structure for each finding:

### Finding 1: [Your Title Here]

**Evidence:** [Your evidence with specific numbers, technology areas, and data points]

**Significance:** [Industry impact, competitive implications, or technology advancement]

**Key Patents:**

- "Exact Patent Title Here" (Patent #US1234567) - Assignee Name, Year
- "Another Exact Patent Title Here" (Patent #US7654321) - Assignee Name, Year

## CRITICAL FORMATTING RULES

1. Patent titles must be enclosed in "quotation marks"
2. Use the EXACT title text from the patent list above
3. Include the patent number in parentheses
4. Include the assignee name and filing year
5. Do NOT use placeholder text like [Patent title] or [Object Object]
6. If you reference a patent, copy its title and number word-for-word from the data above

## Requirements

- Base findings on actual patent data provided above, not assumptions
- Include quantitative evidence (percentages, counts, trends, citation metrics)
- Focus on technology gaps, emerging innovations, or competitive positioning
- Use CPC codes to identify thematic technology clusters
- Reference specific patents by their complete titles and patent numbers
- Consider both patent counts and citation impact

Generate 5-7 key findings now using the EXACT patent titles and numbers from the data provided.
