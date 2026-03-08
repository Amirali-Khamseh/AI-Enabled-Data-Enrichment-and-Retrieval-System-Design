import {
  BlobServiceClient,
  ContainerClient,
} from "@azure/storage-blob";

let containerClient: ContainerClient | null = null;

function getContainerClient(): ContainerClient {
  if (containerClient) return containerClient;

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

  if (!connectionString) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING is not set");
  }
  if (!containerName) {
    throw new Error("AZURE_STORAGE_CONTAINER_NAME is not set");
  }

  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  containerClient = blobServiceClient.getContainerClient(containerName);
  return containerClient;
}

export async function uploadBlob(
  blobName: string,
  data: Record<string, unknown>,
): Promise<string> {
  const client = getContainerClient();
  await client.createIfNotExists();

  const blockBlobClient = client.getBlockBlobClient(blobName);
  const content = JSON.stringify(data);

  await blockBlobClient.upload(content, Buffer.byteLength(content), {
    blobHTTPHeaders: { blobContentType: "application/json" },
  });

  return blockBlobClient.url;
}

export async function downloadBlob(
  blobName: string,
): Promise<Record<string, unknown> | null> {
  const client = getContainerClient();
  const blockBlobClient = client.getBlockBlobClient(blobName);

  const exists = await blockBlobClient.exists();
  if (!exists) return null;

  const response = await blockBlobClient.download(0);
  const body = await streamToString(response.readableStreamBody!);
  return JSON.parse(body);
}

async function streamToString(
  stream: NodeJS.ReadableStream,
): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf-8");
}
