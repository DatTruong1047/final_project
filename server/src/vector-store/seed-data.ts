import { createProductEmbedding } from '@app/utils/document.util';

import VectorStore from './init';

async function seedData(): Promise<void> {
  const vectorStore = await VectorStore.getInstance();

  const documents = await createProductEmbedding();
  if (documents.length > 0) {
    await vectorStore.addDocuments(documents);
  }

  console.log('Documents added to vector store');
  process.exit(0);
}

seedData();
