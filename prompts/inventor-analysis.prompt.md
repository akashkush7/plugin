# Patent Inventor Network Analysis

You are analyzing inventor collaboration patterns and contributions in patent data.

## Inventor Statistics

- **Total Unique Inventors**: {{ stats.inventorStats.totalUniqueInventors }}
- **Average Inventors per Patent**: {{ stats.inventorStats.avgInventorsPerPatent | round(1) }}
- **Maximum Inventors on Single Patent**: {{ stats.inventorStats.maxInventorsPerPatent }}
- **Multi-Inventor Patents**: {{ stats.inventorStats.multiInventorPatents }} ({{ (stats.inventorStats.multiInventorPatents / stats.totalPatents * 100) | round(1) }}%)

## Top Prolific Inventors

{% for inventor in stats.inventorStats.topInventors %}
{{ loop.index }}. {{ inventor.name }}: {{ inventor.count }} patents
{% endfor %}

## Sample Patents with Inventor Details

{% for record in records %}
{% if loop.index <= 25 %}
**{{ record.patentNumber }}** - {{ record.title }}

- Inventors: {{ record.inventors | join(', ') }}
- Assignee: {{ record.assignee }}
- Year: {{ record.patentYear }}
- Citations: {{ record.citationCount }}
  {% endif %}
  {% endfor %}

## Task

Provide a comprehensive inventor network and collaboration analysis (350-450 words) covering:

1. **Collaboration Intensity**: What do the statistics reveal about teamwork in innovation?

   - Multi-inventor vs. solo inventor patterns
   - Average team sizes and what they indicate
   - Comparison of collaboration levels across assignees

2. **Key Contributors**: Who are the most prolific inventors?

   - Highlight top 5-7 inventors by patent count
   - Note any inventors appearing across multiple assignees
   - Identify potential key opinion leaders or technical experts

3. **Inventor-Assignee Relationships**: What patterns exist between inventors and organizations?

   - Are top inventors concentrated in specific assignees?
   - Evidence of inventor mobility between organizations
   - Corporate vs. academic inventor patterns

4. **Collaboration Networks**: What team structures are evident?

   - Large teams vs. small teams
   - Core inventor groups that repeatedly collaborate
   - Cross-organizational collaboration (if evident)

5. **Innovation Leadership**: Who are the innovation drivers?
   - Inventors on highly-cited patents
   - Inventors with diverse technology portfolios
   - Emerging vs. established inventors

## Output Requirements

- Write in analytical paragraphs with clear topic sentences
- Include specific inventor names and patent counts
- Use percentages and statistical comparisons
- Reference specific patents when highlighting key inventors
- Connect inventor patterns to broader innovation implications
- No bullet points - use flowing narrative analysis

## Style

Professional network analysis suitable for talent intelligence, competitive analysis, or academic collaboration studies.

Generate the inventor analysis now based on the provided data.
