import { createProductEmbedding } from '@app/utils/document.util';

import VectorStore from './init';
import app from '@app/app';

async function seedData(): Promise<void> {
  try {
    const vectorStore = await VectorStore.getInstance();

    const documents = await createProductEmbedding();
    if (documents.length > 0) {
      await vectorStore.addDocuments(documents);
    }
  
    app.log.info('Documents added to vector store');
  } catch (error) {
    app.log.error('Error seeding data:', error);
  } finally {
    process.exit(0);
  }
}

seedData();
