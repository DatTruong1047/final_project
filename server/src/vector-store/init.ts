import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { Document } from '@langchain/core/documents';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import pg from 'pg';

import app from '@app/app';
import { vectorStore } from '@app/config/vector-store.config';

import {
  embeddingModel,
  taskTypeEmbedding,
  geminiApiKey,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_VECTOR_DB,
} from '../config';

export default class VectorStore {
  private static _instance: VectorStore;

  private readonly _embeddingModel: GoogleGenerativeAIEmbeddings;
  private readonly _pool: pg.Pool;
  private _vectorStore: PGVectorStore | null = null;

  private constructor() {
    if (!geminiApiKey) {
      throw new Error('Google AI API key is required');
    }

    this._embeddingModel = new GoogleGenerativeAIEmbeddings({
      model: embeddingModel,
      taskType: taskTypeEmbedding,
      apiKey: geminiApiKey,
    });

    this._pool = new pg.Pool({
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      database: POSTGRES_VECTOR_DB,
    });

    this._pool.on('error', (err) => {
      app.log.error('Unexpected error on idle client', err);
    });
  }

  private async _initVectorStore(): Promise<void> {
    if (this._vectorStore) return;

    try {
      this._vectorStore = await PGVectorStore.initialize(this._embeddingModel, {
        postgresConnectionOptions: {
          host: POSTGRES_HOST,
          port: POSTGRES_PORT,
          database: POSTGRES_VECTOR_DB,
          user: POSTGRES_USER,
          password: POSTGRES_PASSWORD,
        },
        tableName: vectorStore.tableName,
        columns: vectorStore.columns,
      });
    } catch (error) {
      app.log.error('Error initializing vector store:', error);
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
      app.log.error('Error adding documents:', error);
      throw new Error(`Failed to add documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async similaritySearch(query: string, k = 10): Promise<Document[]> {
    try {
      await this._initVectorStore();
      if (!this._vectorStore) {
        throw new Error('Vector store not initialized');
      }

      const embeddingQuery = await this._embeddingModel.embedQuery(query);

      const result = await this._vectorStore.similaritySearchVectorWithScore(embeddingQuery, k);

      return result.map((item) => item[0]);
    } catch (error) {
      app.log.error('Error performing similarity search:', error);
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
