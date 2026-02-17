import { getGeminiClient } from "@/utils/GeminiClient";

export async function consolidationService(reqBody: unknown) {
  try {
    if (!reqBody) {
      throw new Error("reqBody is required!");
    }

    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Please consolidate and analyze this data: ${JSON.stringify(reqBody)}`,
    });

    const responseText = response.text;

    return {
      success: true,
      data: responseText,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Consolidation error:", error);
    throw new Error(
      `Consolidation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
