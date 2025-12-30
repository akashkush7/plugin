import { z } from "zod";

export const PatentRecordSchema = z.object({
  patentNumber: z.string(),
  title: z.string(),
  abstract: z.string().default("No abstract available"),
  inventors: z.array(z.string()).default([]),
  assignee: z.string().default("Unknown Assignee"),
  patentDate: z.string().default(""),
  patentYear: z.number(),
  patentType: z.string().default(""),
  cpcCodes: z.array(z.string()).default([]),
  cpcTitles: z.array(z.string()).default([]),
  citationCount: z.number().default(0),
  citedByCount: z.number().default(0),
});

export type PatentRecord = z.infer<typeof PatentRecordSchema>;
