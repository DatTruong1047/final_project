import { BaseTool } from '../base/base.tool';
import {
  ProductListType,
  ProductMetadataType,
  ProductSearchQuerySchema,
  ProductSearchQueryType,
  ResultType,
} from '@model';
import ProductService from '@services/product.service';
import app from '@app/app';
import VectorStore from '@app/vector-store/init';
import { Document } from '@langchain/core/documents';
import { mapProductDocumentToMetadata } from '@app/utils/mapper/product.mapper';

export class ProductSearchTool extends BaseTool {
  protected name = 'product_search';
  protected description = 'Search for products using text query and filters';
  protected schema = ProductSearchQuerySchema;
  private readonly _productService: ProductService;

  constructor(productService: ProductService) {
    super();
    this._productService = productService;
  }

  async search(query: string): Promise<Document[]> {
    try {
      const vectorStore = await VectorStore.getInstance();
      const result = await vectorStore.similaritySearch(query);
      if (!result || result.length === 0) {
        return [];
      }
      return result;
    } catch (error) {
      app.log.error('Error in search:', error);
      throw error;
    }
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

  async execute(input: ProductSearchQueryType) {
    return await this.productSearch(input);
  }
}
