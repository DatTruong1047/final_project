import { StructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

import app from '@app/app';

import ProductService from '@services/product.service';
import { ProductComparisonInputType, ProductComparisonSchema } from '@app/models/product.schema';

export class ProductComparisonTool extends StructuredTool {
  name = 'product_comparison';
  description = 'Lấy dữ liệu để so sánh giữa các sản phẩm';
  schema = ProductComparisonSchema;

  private readonly _productService: ProductService;

  constructor(productService: ProductService) {
    super();
    this._productService = productService;
  }

  async _call(input: ProductComparisonInputType): Promise<string> {
    try {
      const findResult = await this._productService.getProductsByNames(input.productNames);
      const { found, notFound } = findResult.data;

      if (!found || found.length < 2) {
        throw new Error(
          `Not enough products found for comparison. Products not found: ${notFound?.join(', ') || 'none'}`
        );
      }

      const attrSharedResult = found && found.length > 0 ? this._productService.getAttrShared(found) : null;

      if (attrSharedResult === null || attrSharedResult.attributes.length === 0) {
        throw new Error(`No shared attributes found between the selected products`);
      }

      const { productNames, attributes } = attrSharedResult;

      return JSON.stringify({
        productNames,
        notFoundProductNames: notFound,
        attributes,
      });
    } catch (error) {
      app.log.error('Error in productComparison:', error);
      return JSON.stringify({
        result: [],
        message: `Đã xảy ra lỗi khi tìm kiếm sản phẩm. Vui lòng thử lại: ${
          error instanceof Error ? error.message : String(error)
        }`,
        errorDetail: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
