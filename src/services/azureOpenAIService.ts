import { AzureOpenAI } from "openai";

let client: AzureOpenAI | null = null;

function getOpenAIClient(): AzureOpenAI {
  if (client) return client;

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

  if (!endpoint) throw new Error("AZURE_OPENAI_ENDPOINT is not set");
  if (!apiKey) throw new Error("AZURE_OPENAI_API_KEY is not set");

  client = new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion: apiVersion || "2024-12-01-preview",
  });

  return client;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const openai = getOpenAIClient();
  const deploymentName = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME;
  if (!deploymentName) {
    throw new Error("AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME is not set");
  }

  const response = await openai.embeddings.create({
    model: deploymentName,
    input: text,
  });

  return response.data[0].embedding;
}

export async function chatCompletion(
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const openai = getOpenAIClient();
  const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
  if (!deploymentName) {
    throw new Error("AZURE_OPENAI_DEPLOYMENT_NAME is not set");
  }

  const response = await openai.chat.completions.create({
    model: deploymentName,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.3,
    max_tokens: 1024,
  });

  return response.choices[0]?.message?.content || "";
}
