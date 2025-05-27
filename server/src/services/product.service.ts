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
      throw error;
    }
  }

  async findProductByApproxName(name: string): Promise<ResultType<ProductMetadataType>> {
    const product = await this._productRepository.findProductByApproxName(name);
    return {
      code: 200,
      message: 'Product found',
      success: true,
      data: product,
    };
  }

  async findManyProductByApproxName(name: string): Promise<ResultType<ProductMetadataType[]>> {
    const products = await this._productRepository.findManyProductByApproxName(name);
    return {
      code: 200,
      message: 'Products found',
      success: true,
      data: products,
    };
  }

  async findSimilarProductIds(name: string, limit = 1): Promise<ResultType<{ id: string; similarity: number }[]>> {
    const productIds = await this._productRepository.findSimilarProductIds(name, limit);
    return {
      code: 200,
      message: 'Product IDs found',
      success: true,
      data: productIds,
    };
  }

  async getProductsByNames(names: string[]): Promise<ResultType<{ found: ProductMetadataType[]; notFound: string[] }>> {
    try {
      const found: ProductMetadataType[] = [];
      const notFound: string[] = [];
      for (const name of names) {
        const product = await this._productRepository.findProductByApproxName(name);
        if (product) {
          found.push(product);
        } else {
          notFound.push(name);
        }
      }

      return {
        code: 200,
        message: 'Product found',
        success: true,
        data: {
          found,
          notFound,
        },
      };
    } catch (error) {
      app.log.error('Error in findProductByApproxName:', error);
      throw error;
    }
  }

  getAttrShared(products: ProductMetadataType[]): {
    productNames: string[];
    attributes: { name: string; values: string[] }[];
  } | null {
    const attrCounts: Record<string, number> = {};

    for (const product of products) {
      for (const attr in product.attributes) {
        attrCounts[attr] = (attrCounts[attr] || 0) + 1;
      }
    }

    const sharedAttrs = Object.keys(attrCounts)
      .filter((attr) => attrCounts[attr] === products.length)
      .map((attr) => attr);

    const attributes = sharedAttrs.map((attr) => ({
      name: attr,
      values: products.map((product) => product.attributes[attr]),
    }));

    return {
      productNames: products.map((product) => product.name),
      attributes,
    };
  }
}
