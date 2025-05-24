import { Document } from '@langchain/core/documents';
import { MessageContent } from '@langchain/core/messages';

import app from '@app/app';
import {
  ProductComparisonInputType,
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

      // Remove duplicate products based on a unique SKU
      const uniqueProducts = new Map<string, ProductMetadataType>();
      [...fullTextData, ...similarityData].forEach((product) => {
        uniqueProducts.set(product.sku, product);
      });

      const products = Array.from(uniqueProducts.values());
      const total = products.length;
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

  /**
   * Product comparison
   * @param query
   * @param query.product_names list of product names
   * @param query.comparison_criteria comparison criteria, nullable
   * @returns list of product names, shared attributes, and comparison criteria
   */
  async getDataForProductComparison(query: ProductComparisonInputType): Promise<ResultType<{
    productNames: string[];
    notFoundProductNames: string[];
    attributes: { name: string; values: string[] }[];
    comparisonCriteria: string;
  }>> {
    try {

      const findResult = await this._productService.findProductByApproxName(query.productNames);
      const { found, notFound } = findResult.data;

      if(!found || found.length < 2) {
        return {
          code: 400,
          message: 'At least 2 products are required for comparison',
          success: false,
        };
      }

      const attrSharedResult = found && found.length > 0 ? this._productService.getAttrShared(found) : null;

      if (attrSharedResult === null || attrSharedResult.attributes.length === 0) {
        return {
          code: 400,
          message: 'No shared attributes found',
          success: false,
        };
      }

      const { productNames , attributes } = attrSharedResult;


      return {
        code: 200,
        message: 'Product comparison successful',
        success: true,
        data: {
          productNames,
          notFoundProductNames: notFound,
          attributes,
          comparisonCriteria: query.comparisonCriteria,
        },
      };
    } catch (error) {
      app.log.error('Error in productComparison:', error);
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
