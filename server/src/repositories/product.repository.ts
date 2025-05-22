import {
  FullTextQueryType,
  ProductBaseType,
  ProductDetailType,
  ProductFilterType,
  ProductForCreateOrderType,
  ProductListType,
  ProductMetadataType,
  ProductSearchQueryType,
} from '@model';
import { Prisma, PrismaClient } from 'generated/prisma';

import prisma from '@app/lib/prisma';
import app from '@app/app';

export default class ProductRepository {
  private readonly _prisma: PrismaClient;

  constructor() {
    this._prisma = prisma;
  }

  async getProductForCreateOrder(name: string): Promise<ProductForCreateOrderType > {
    const product = await this._prisma.product.findUnique({
      where: { name },
      select: {
        id: true,
        name: true,
        code: true,
        price: true,
        quantity: true,
      }
    });

    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    return {
      ...product,
      price: product.price.toNumber(),
    };
  }

  async getProductById(id: string): Promise<ProductDetailType> {
    const product = await this._prisma.product.findUnique({
      where: { id },
      select: this._productSelectDetail,
    });

    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    return {
      ...product,
      price: product.price.toNumber(),
      reviews: product.reviews.map((review) => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
      })),
    };
  }

  async getProductList(filter: ProductFilterType): Promise<ProductListType> {
    const { page = 1, limit = 8, brandId, categoryId, searchText, minPrice, maxPrice, sortBy, sortOrder } = filter;
    const skip = (page - 1) * limit;
    const [products, total] = await this._prisma.$transaction([
      this._prisma.product.findMany({
        where: {
          ...(brandId && { brandId }),
          ...(categoryId && { categoryId }),
          ...this._textSearchQuery(searchText),
          ...(minPrice && { price: { gte: minPrice } }),
          ...(maxPrice && { price: { lte: maxPrice } }),
        },
        skip,
        take: limit,
        select: this._productSelectBase,
        orderBy: {
          ...(sortBy && { [sortBy]: sortOrder }),
        },
      }),
      this._prisma.product.count({
        where: {
          ...(brandId && { brandId }),
          ...(categoryId && { categoryId }),
          ...this._textSearchQuery(searchText),
          ...(minPrice && { price: { gte: minPrice } }),
          ...(maxPrice && { price: { lte: maxPrice } }),
        },
      }),
    ]);
    return {
      products: products.map((product) => ({
        ...product,
        price: product.price.toNumber(),
        thumbnail: product.productMedias.length > 0 ? product.productMedias[0] : null,
      })),
      total: total,
      page,
      limit,
    };
  }

  async updateQuantity(
    tx: Prisma.TransactionClient,
    id: string,
    quantity: number,
    method: 'increment' | 'decrement'
  ): Promise<boolean> {
    try {
      await tx.product.update({
        where: { id },
        data: { quantity: { [method]: quantity } },
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to update quantity: ${error.message}`);
    }
  }

  async fullTextSearch(params: FullTextQueryType): Promise<ProductMetadataType[]> {
    try {
      const { limit, ...fullTextQuery } = params;
      const products = await this._prisma.product.findMany({
        where: {
          ...this._fullTextSearchQuery(fullTextQuery),
        },
        select: this._productSelectMetadata,
        take: limit,
        orderBy: {
          price: 'asc',
        },
      });

      return products.map((product) => ({
        ...product,
        slug: product.name,
        sku: product.code,
        summary: product.shortDescription,
        price: product.price.toNumber(),
        attributes: product.attributes.reduce((acc, attribute) => {
          acc[attribute.attributeKey] = attribute.attributeValue;
          return acc;
        }, {} as Record<string, string>),
      }));
    } catch (error) {
      app.log.error('Error in fullTextSearch:', error);
      throw new Error(`Failed to fullTextSearch: ${error.message}`);
    }
  }

  private _textSearchQuery(searchText: string): Prisma.ProductWhereInput {
    if (!searchText || searchText.trim() === '') {
      return {};
    }
    return {
      OR: [
        {
          name: {
            contains: searchText,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          shortDescription: {
            contains: searchText,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          attributes: {
            some: {
              attributeValue: {
                contains: searchText,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        },
      ],
    };
  }

  private _fullTextSearchQuery(params: FullTextQueryType): Prisma.ProductWhereInput {
    const andConditions: Prisma.ProductWhereInput[] = [];

    if (params.category_name) {
      andConditions.push({
        category: { name: { equals: params.category_name } },
      });
    }

    if (params.brand_name) {
      andConditions.push({ brand: { name: { equals: params.brand_name } } });
    }

    if (params.price_min != undefined) {
      andConditions.push({ price: { gte: params.price_min } });
    }

    if (params.price_max != undefined) {
      andConditions.push({ price: { lte: params.price_max } });
    }

    const orConditions: Prisma.ProductWhereInput[] = [];

    if (params.product_name) {
      orConditions.push({ name: { contains: params.product_name, mode: Prisma.QueryMode.insensitive } });
    }

    if (params.attributes_values) {
      orConditions.push({
        attributes: { some: { attributeValue: { in: params.attributes_values, mode: Prisma.QueryMode.insensitive } } },
      });
    }

    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }

    return {
      AND: andConditions.filter(Boolean),
    };
  }

  private readonly _productSelectBase = {
    id: true,
    name: true,
    code: true,
    price: true,
    shortDescription: true,
    categoryId: true,
    category: {
      select: {
        id: true,
        name: true,
      },
    },
    brandId: true,
    brand: {
      select: {
        id: true,
        name: true,
      },
    },
    productMedias: {
      take: 1,
      select: {
        id: true,
        media: {
          select: {
            id: true,
            url: true,
            description: true,
          },
        },
      },
    },
  };

  private readonly _productSelectDetail = {
    ...this._productSelectBase,
    longDescription: true,
    quantity: true,
    attributes: {
      select: {
        attributeKey: true,
        attributeValue: true,
      },
    },
    productMedias: {
      select: {
        id: true,
        media: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    },
    reviews: {
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  };

  private readonly _productSelectMetadata = {
    id: true,
    name: true,
    code: true,
    price: true,
    shortDescription: true,
    productMedias: {
      take: 1,
      select: {
        id: true,
        media: { select: { url: true } },
      },
    },
    category: { select: { name: true } },
    brand: { select: { name: true } },
    attributes: { select: { attributeKey: true, attributeValue: true } },
  };
}
