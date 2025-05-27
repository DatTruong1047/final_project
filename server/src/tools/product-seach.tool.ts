import { StructuredTool } from '@langchain/core/tools';
import { Document } from 'langchain/document';
import { z } from 'zod';

import app from '@app/app';
import { ProductMetadataType } from '@app/models/product.schema';
import ProductService from '@app/services/product.service';
import { mapProductDocumentToMetadata } from '@app/utils/mapper/product.mapper';
import VectorStore from '@app/vector-store/init';

const ProductSearchSchema = z.object({
  query: z
    .string()
    .describe(
      'Từ khóa hoặc câu mô tả chung về sản phẩm cần tìm kiếm (ví dụ: "điện thoại thông minh", "máy giặt cửa ngang", "tai nghe bluetooth"). Bắt buộc phải có.'
    ),
  productName: z
    .string()
    .describe('Tên sản phẩm cụ thể hoặc một phần của tên sản phẩm (ví dụ: "iPhone 15 Pro Max", "Tủ lạnh Samsung").')
    .default(''),
  categoryName: z
    .string()
    .describe('Tên danh mục sản phẩm (ví dụ: "Điện thoại", "Tủ lạnh", "Tivi", "Máy giặt").')
    .optional(),
  brandName: z.string().describe('Tên thương hiệu của sản phẩm (ví dụ: "Samsung", "Apple", "LG").').optional(),
  priceMin: z.number().describe('Giá tối thiểu của sản phẩm.').min(0).default(0).optional(),
  priceMax: z.number().describe('Giá tối đa của sản phẩm.').min(0).default(1000000000).optional(),
  attributesValues: z
    .array(z.string())
    .describe(
      'Các giá trị của thuộc tính kỹ thuật của sản phẩm (ví dụ: "8GB", "6.5 inch", "256GB", "1000W", "Android", "15kg").'
    )
    .default([])
    .optional(),
});

type ProductSearchQueryType = z.infer<typeof ProductSearchSchema>;

export class ProductSearchTool extends StructuredTool {
  name = 'product_search';
  description = 'Tìm kiếm sản phẩm dựa trên câu hỏi và các tiêu chí lọc';
  schema = ProductSearchSchema;

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

  protected async _call(input: ProductSearchQueryType): Promise<string> {
    try {
      const { query: searchText, ...fullTextQuery } = input;

      let fullTextData: ProductMetadataType[] = [];
      let similarityData: ProductMetadataType[] = [];

      const [fullTextResult, similarityResult] = await Promise.all([
        this._productService.fullTextSearch(fullTextQuery),
        this.search(searchText),
      ]);

      fullTextData = fullTextResult.data || [];

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

      if (total === 0) {
        return JSON.stringify({
          result: [],
          message: 'Không tìm thấy sản phẩm nào phù hợp với yêu cầu.',
        });
      }

      const formattedProducts = products.map((product) => ({
        sku: product.sku || '',
        name: product.name || '',
        brand_name: product.brand_name || '',
        price: product.price || 0, // Đảm bảo là số
        category_name: product.category_name || '',
        attributes: product.attributes || {},
        image: product.image || '',
      }));

      const finalOutput = {
        result: formattedProducts,
        message: 'Đã tìm thấy sản phẩm sau.',
      };

      return JSON.stringify(finalOutput);
    } catch (error) {
      app.log.error('Error in productSearch _call:', error);
      return JSON.stringify({
        result: [],
        message: `Đã xảy ra lỗi khi tìm kiếm sản phẩm. Vui lòng thử lại: ${
          error instanceof Error ? error.message : String(error)
        }`,
        errorDetail: error instanceof Error ? error.message : String(error), // Có thể thêm trường lỗi chi tiết
      });
    }
  }
}
