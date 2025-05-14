import { ErrorCodes } from '@app/config';
import { ProductDetailType, ProductFilterType, ProductListType, ResultType } from '@app/models';
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
}
