import { Document } from '@langchain/core/documents';
import VectorStore from '@app/vector-store/init';

export default class ChatService {
  constructor() {}

  async search(query: string): Promise<Document[]> {
    const vectorStore = await VectorStore.getInstance();
    const result = await vectorStore.similaritySearch(query);
    return result;
  }
}

