import { BaseTool } from '../base/base.tool';
import { ProductComparisonInputSchema, ProductComparisonInputType, ResultType } from '@model';
import ProductService from '@services/product.service';
import app from '@app/app';

export class ProductComparisonTool extends BaseTool {
  protected name = 'product_comparison';
  protected description = 'Compare products based on their attributes';
  protected schema = ProductComparisonInputSchema;
  private readonly _productService: ProductService;

  constructor(productService: ProductService) {
    super();
    this._productService = productService;
  }

  /**
   * Product comparison
   * @param query
   * @param query.product_names list of product names
   * @param query.comparison_criteria comparison criteria, nullable
   * @returns list of product names, shared attributes, and comparison criteria
   */
  async getDataForProductComparison(query: ProductComparisonInputType): Promise<
    ResultType<{
      productNames: string[];
      notFoundProductNames: string[];
      attributes: { name: string; values: string[] }[];
      comparisonCriteria: string;
    }>
  > {
    try {
      const findResult = await this._productService.findProductByApproxName(query.productNames);
      const { found, notFound } = findResult.data;

      if (!found || found.length < 2) {
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

      const { productNames, attributes } = attrSharedResult;

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

  async execute(input: ProductComparisonInputType) {
    return await this.getDataForProductComparison(input);
  }
}
