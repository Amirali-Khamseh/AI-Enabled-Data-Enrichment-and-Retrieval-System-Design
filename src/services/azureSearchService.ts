import {
  SearchClient,
  SearchIndexClient,
  AzureKeyCredential,
  KnownAnalyzerNames,
  KnownVectorSearchAlgorithmKind,
  SearchIndex,
} from "@azure/search-documents";
import { generateEmbedding } from "./azureOpenAIService";

export interface SubjectDocument {
  id: string;
  title: string;
  description: string;
  language: string;
  topicDomain: string;
  contentLanguage: string;
  geographicScope: string;
  contextualScope: string;
  contentVector?: number[];
  blobUrl?: string;
  timestamp?: string;
}

export interface SearchResult {
  document: SubjectDocument;
  score: number;
  rerankerScore?: number;
}

function getSearchConfig() {
  const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
  const adminKey = process.env.AZURE_SEARCH_ADMIN_KEY;
  const indexName = process.env.AZURE_SEARCH_INDEX_NAME;

  if (!endpoint) throw new Error("AZURE_SEARCH_ENDPOINT is not set");
  if (!adminKey) throw new Error("AZURE_SEARCH_ADMIN_KEY is not set");
  if (!indexName) throw new Error("AZURE_SEARCH_INDEX_NAME is not set");

  return { endpoint, adminKey, indexName };
}

function getIndexClient(): SearchIndexClient {
  const { endpoint, adminKey } = getSearchConfig();
  return new SearchIndexClient(endpoint, new AzureKeyCredential(adminKey));
}

function getSearchClient(): SearchClient<SubjectDocument> {
  const { endpoint, adminKey, indexName } = getSearchConfig();
  return new SearchClient<SubjectDocument>(
    endpoint,
    indexName,
    new AzureKeyCredential(adminKey),
  );
}

export async function createSearchIndex(): Promise<void> {
  const indexClient = getIndexClient();
  const { indexName } = getSearchConfig();

  const indexDefinition: SearchIndex = {
    name: indexName,
    fields: [
      { name: "id", type: "Edm.String", key: true, filterable: true },
      {
        name: "title",
        type: "Edm.String",
        searchable: true,
        analyzerName: KnownAnalyzerNames.EnLucene,
      },
      {
        name: "description",
        type: "Edm.String",
        searchable: true,
        analyzerName: KnownAnalyzerNames.EnLucene,
      },
      {
        name: "language",
        type: "Edm.String",
        filterable: true,
        facetable: true,
      },
      {
        name: "topicDomain",
        type: "Edm.String",
        searchable: true,
        filterable: true,
        facetable: true,
      },
      {
        name: "contentLanguage",
        type: "Edm.String",
        filterable: true,
        facetable: true,
      },
      {
        name: "geographicScope",
        type: "Edm.String",
        filterable: true,
        facetable: true,
      },
      {
        name: "contextualScope",
        type: "Edm.String",
        filterable: true,
        facetable: true,
      },
      {
        name: "contentVector",
        type: "Collection(Edm.Single)",
        searchable: true,
        vectorSearchDimensions: 1536,
        vectorSearchProfileName: "vector-profile",
      },
      { name: "blobUrl", type: "Edm.String" },
      { name: "timestamp", type: "Edm.String", sortable: true },
    ],
    vectorSearch: {
      algorithms: [
        {
          name: "hnsw-algorithm",
          kind: KnownVectorSearchAlgorithmKind.Hnsw,
          parameters: {
            metric: "cosine",
            m: 4,
            efConstruction: 400,
            efSearch: 500,
          },
        },
      ],
      profiles: [
        {
          name: "vector-profile",
          algorithmConfigurationName: "hnsw-algorithm",
        },
      ],
    },
    semanticSearch: {
      configurations: [
        {
          name: "semantic-config",
          prioritizedFields: {
            titleField: { name: "title" },
            contentFields: [{ name: "description" }],
            keywordsFields: [{ name: "topicDomain" }],
          },
        },
      ],
    },
  };

  try {
    await indexClient.getIndex(indexName);
    await indexClient.createOrUpdateIndex(indexDefinition);
  } catch {
    await indexClient.createIndex(indexDefinition);
  }
}

export async function indexDocument(doc: SubjectDocument): Promise<void> {
  const searchClient = getSearchClient();

  const textForEmbedding = `${doc.title}. ${doc.description}. Topic: ${doc.topicDomain}. Scope: ${doc.contextualScope}`;
  const contentVector = await generateEmbedding(textForEmbedding);

  await searchClient.mergeOrUploadDocuments([{ ...doc, contentVector }]);
}

export async function indexDocuments(docs: SubjectDocument[]): Promise<void> {
  const searchClient = getSearchClient();

  const docsWithVectors = await Promise.all(
    docs.map(async (doc) => {
      const textForEmbedding = `${doc.title}. ${doc.description}. Topic: ${doc.topicDomain}. Scope: ${doc.contextualScope}`;
      const contentVector = await generateEmbedding(textForEmbedding);
      return { ...doc, contentVector };
    }),
  );

  await searchClient.mergeOrUploadDocuments(docsWithVectors);
}

export async function hybridSearch(
  query: string,
  top: number = 5,
): Promise<SearchResult[]> {
  const searchClient = getSearchClient();
  const queryVector = await generateEmbedding(query);

  const searchResults = await searchClient.search(query, {
    vectorSearchOptions: {
      queries: [
        {
          kind: "vector",
          vector: queryVector,
          kNearestNeighborsCount: top,
          fields: ["contentVector"],
        },
      ],
    },
    queryType: "semantic",
    semanticSearchOptions: {
      configurationName: "semantic-config",
    },
    top,
    select: [
      "id",
      "title",
      "description",
      "language",
      "topicDomain",
      "contentLanguage",
      "geographicScope",
      "contextualScope",
      "blobUrl",
      "timestamp",
    ],
  });

  const results: SearchResult[] = [];
  for await (const result of searchResults.results) {
    results.push({
      document: result.document,
      score: result.score ?? 0,
      rerankerScore: result.rerankerScore ?? undefined,
    });
  }

  return results;
}
