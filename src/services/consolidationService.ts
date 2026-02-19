import {
  GEMINI_MODEL,
  GEMINI_UNIFICATION_ENRICHMENT_PROMPT,
} from "@/app/const";
import { reqBodySchema } from "@/app/schema";
import { getGeminiClient } from "@/utils/GeminiClient";
import * as z from "zod";
export async function consolidationService(reqBody: unknown) {
  try {
    if (!reqBody) {
      throw new Error("reqBody is required!");
    }

    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: `${GEMINI_UNIFICATION_ENRICHMENT_PROMPT} ${JSON.stringify(reqBody)}`,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(reqBodySchema),
      },
    });
    const responseData = response?.text;
    const parsedData = responseData ? JSON.parse(responseData) : null;
    const validatedData = reqBodySchema.safeParse(parsedData);

    if (validatedData.success) {
      return {
        success: true,
        data: validatedData.data,
        timestamp: new Date().toISOString(),
      };
    }
    throw new Error("Incompatible type: response data does not match schema");
  } catch (error) {
    console.error("Consolidation error:", error);
    throw new Error(
      `Consolidation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
