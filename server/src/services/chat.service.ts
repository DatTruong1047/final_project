import { Document } from '@langchain/core/documents';
import { MessageContent } from '@langchain/core/messages';

import app from '@app/app';
import { ResultType } from '@app/models';
import VectorStore from '@app/vector-store/init';

import GeminiService from '@services/gemini.service';

export default class ChatService {
  private readonly _geminiService: GeminiService;

  constructor() {
    this._geminiService = new GeminiService();
  }

  async search(query: string): Promise<Document[]> {
    const vectorStore = await VectorStore.getInstance();
    const result = await vectorStore.similaritySearch(query);
    return result;
  }

  async sendMessage(query: string): Promise<ResultType<MessageContent>> {
    try {
      const res = await this._geminiService.generateResponse(query);
      return res;
    } catch (error) {
      app.log.error('Error in sendMessage:', error);
      throw new Error('Server error');
    }
  }
}
