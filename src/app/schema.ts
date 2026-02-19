import { Content } from "next/font/google";
import * as z from "zod";

export const reqBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  language: z.string(),
  topicDomain: z.string(),
  contentLanguage: z.string(),
  geographicScope: z.string(),
  contextualScope: z.string(),
});

export type reqBodyType = z.infer<typeof reqBodySchema>;
