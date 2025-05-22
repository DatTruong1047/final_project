import { Document } from '@langchain/core/documents';
import { MessageContent } from '@langchain/core/messages';

import app from '@app/app';
import {
  ProductListType,
  ProductMetadataType,
  ProductSearchQueryType,
  ResultType,
} from '@app/models';
import VectorStore from '@app/vector-store/init';

import GeminiService from '@services/gemini.service';
import ProductService from './product.service';
import { mapProductDocumentToMetadata } from '@app/utils/mapper/product.mapper';

export default class ChatService {
  private readonly _geminiService: GeminiService;
  private readonly _productService: ProductService;

  constructor(geminiService: GeminiService, productService: ProductService) {
    this._geminiService = geminiService;
    this._productService = productService;
  }

  async search(query: string): Promise<Document[]> {
    const vectorStore = await VectorStore.getInstance();
    const result = await vectorStore.similaritySearch(query);
    return result;
  }

  async productSearch(query: ProductSearchQueryType): Promise<ResultType<ProductListType>> {
    try {
      const { query: searchText, ...fullTextQuery } = query;

      let fullTextData: ProductMetadataType[] = [];
      let similarityData: ProductMetadataType[] = [];

      let fullTextResult = await this._productService.fullTextSearch(fullTextQuery);

      fullTextData = fullTextResult.data || [];

      const similarityResult = await this.search(searchText);

      if (similarityResult.length > 0) {
        similarityData = similarityResult.map((item) => mapProductDocumentToMetadata(item));
      }

      const products = [...fullTextData, ...similarityData];
      const total = fullTextData.length + similarityData.length;

      return {
        code: 200,
        message: 'Product search successful',
        success: true,
        data: {
          products,
          total,
        },
      };
    } catch (error) {
      app.log.error('Error in productSearch:', error);
      throw error;
    }
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
