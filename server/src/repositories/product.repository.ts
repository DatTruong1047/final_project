import { ProductDetailType, ProductFilterType, ProductListType } from '@model';
import { Prisma, PrismaClient } from 'generated/prisma';

import prisma from '@app/lib/prisma';

export default class ProductRepository {
  private readonly _prisma: PrismaClient;

  constructor() {
    this._prisma = prisma;
  }

  async getProductById(id: string): Promise<ProductDetailType> {
    const product = await this._prisma.product.findUnique({
      where: { id },
      select: {
        ...this._productSelectBase,
        longDescription: true,
        quantity: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
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
      },
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
}
