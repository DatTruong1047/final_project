import app from '@app/app';
import { ErrorCodes } from '@app/config';
import {
  FullTextQueryType,
  ProductDetailType,
  ProductFilterType,
  ProductListType,
  ProductMetadataType,
  ResultType,
} from '@app/models';
import ProductRepository from '@app/repositories/product.repository';

export default class ProductService {
  private readonly _productRepository: ProductRepository;

  constructor() {
    this._productRepository = new ProductRepository();
  }

  async getProductById(id: string): Promise<ResultType<ProductDetailType>> {
    const product = await this._productRepository.getProductById(id);

    if (!product) {
      return {
        code: ErrorCodes.PRODUCT_NOT_FOUND,
        message: 'Product not found',
        success: false,
      };
    }

    return {
      code: 200,
      message: 'Product found',
      success: true,
      data: product,
    };
  }

  async getProductList(filter: ProductFilterType): Promise<ResultType<ProductListType>> {
    const productList = await this._productRepository.getProductList(filter);

    return {
      code: 200,
      message: 'Product list found',
      success: true,
      data: productList,
    };
  }

  async fullTextSearch(params: FullTextQueryType): Promise<ResultType<ProductMetadataType[]>> {
    try {
      const productList = await this._productRepository.fullTextSearch(params);

      return {
        code: 200,
        message: 'Product list found',
        success: true,
        data: productList,
      };  
    } catch (error) {
      app.log.error('Error in fullTextSearch:', error);
      return {
        code: ErrorCodes.SERVER_ERROR,
        message: 'Internal server error',
        success: false,
      };
    }
  }
}
