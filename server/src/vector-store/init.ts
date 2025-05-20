import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Document } from '@langchain/core/documents';
import pg from 'pg';
import {
  embeddingModel,
  taskTypeEmbedding,
  apiKeyEmbedding,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
} from '../config';
import { vectorStore } from '@app/config/vector-store.config';

export default class VectorStore {
  private static _instance: VectorStore;

  private readonly _embeddingModel: GoogleGenerativeAIEmbeddings;
  private readonly _pool: pg.Pool;
  private _vectorStore: PGVectorStore | null = null;

  private constructor() {
    if (!apiKeyEmbedding) {
      throw new Error('Google AI API key is required');
    }

    this._embeddingModel = new GoogleGenerativeAIEmbeddings({
      model: embeddingModel,
      taskType: taskTypeEmbedding,
      apiKey: apiKeyEmbedding,
    });

    this._pool = new pg.Pool({
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      database: POSTGRES_DB,
    });

    this._pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  private async _initVectorStore(): Promise<void> {
    if (this._vectorStore) return;

    try {
      this._vectorStore = await PGVectorStore.initialize(this._embeddingModel, {
        postgresConnectionOptions: {
          host: POSTGRES_HOST,
          port: POSTGRES_PORT,
          database: POSTGRES_DB,
          user: POSTGRES_USER,
          password: POSTGRES_PASSWORD,
        },
        tableName: vectorStore.tableName,
        columns: vectorStore.columns,
      });
    } catch (error) {
      console.error('Error initializing vector store:', error);
      throw new Error(`Failed to initialize vector store: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public static async getInstance(): Promise<VectorStore> {
    if (!VectorStore._instance) {
      VectorStore._instance = new VectorStore();
    }
    return VectorStore._instance;
  }

  public async addDocuments(docs: Document[]): Promise<void> {
    try {
      await this._initVectorStore();

      const documents = docs.map((document) => ({
        pageContent: document.pageContent,
        metadata: document.metadata || {},
      }));

      await this._vectorStore?.addDocuments(documents);
    } catch (error) {
      console.error('Error adding documents:', error);
      throw new Error(`Failed to add documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async similaritySearch(query: string, k: number = 10): Promise<Document[]> {
    try {
      await this._initVectorStore();
      if (!this._vectorStore) {
        throw new Error('Vector store not initialized');
      }

      const embeddingQuery = await this._embeddingModel.embedQuery(query);

      const result = await this._vectorStore.similaritySearchVectorWithScore(embeddingQuery, k);
      console.log('Search results:');
      result.forEach((item, index) => {
        console.log(`Result ${index + 1}:`);
        console.log('Document:', item[0].metadata.product_name);
        console.log('Score:', item[1]);
        console.log('Content:', item[0].pageContent.substring(0, 300) + '...');
      });

      return result.map((item) => item[0]);
    } catch (error) {
      console.error('Error performing similarity search:', error);
      throw new Error(
        `Failed to perform similarity search: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  public async close(): Promise<void> {
    try {
      await this._pool.end();
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
}
