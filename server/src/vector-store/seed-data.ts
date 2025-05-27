import fs from 'fs/promises';
import path from 'path';

import app from '@app/app';

import VectorStore from './init';

async function seedData(): Promise<void> {
  try {
    const vectorStore = await VectorStore.getInstance();

    // const documents = await createProductEmbedding();
    const documents = await fs.readFile(path.join(__dirname, '../../data/product_documents.json'), 'utf-8');
    if (documents.length > 0) {
      await vectorStore.addDocuments(JSON.parse(documents));
    }

    app.log.info('Documents added to vector store');
  } catch (error) {
    app.log.error('Error seeding data:', error);
  } finally {
    process.exit(0);
  }
}

seedData();
