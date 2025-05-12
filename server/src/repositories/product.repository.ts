import prisma from '@app/lib/prisma';
import { ProductDetailType, ProductFilterType, ProductListType } from '@model';
import { PrismaClient } from 'generated/prisma';

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
    const { page = 1, limit = 8, brandId, categoryId } = filter;
    const skip = (page - 1) * limit;
    const [products, total] = await this._prisma.$transaction([
      this._prisma.product.findMany({
        where: {
          ...(brandId && { brandId }),
          ...(categoryId && { categoryId }),
        },
        skip,
        take: limit,
        select: this._productSelectBase,
      }),
      this._prisma.product.count({
        where: {
          ...(brandId && { brandId }),
          ...(categoryId && { categoryId }),
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
