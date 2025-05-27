import removeAccents from 'remove-accents';

import {
  FullTextQueryType,
  ProductDetailType,
  ProductFilterType,
  ProductForCreateOrderType,
  ProductListType,
  ProductMetadataType,
} from '@model';
import { Prisma, PrismaClient } from 'generated/prisma';

import app from '@app/app';
import prisma from '@app/lib/prisma';

export default class ProductRepository {
  private readonly _prisma: PrismaClient;

  constructor() {
    this._prisma = prisma;
  }

  async getProductForCreateOrder(id: string): Promise<ProductForCreateOrderType> {
    const product = await this._prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        code: true,
        price: true,
        quantity: true,
      },
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

  async findSimilarProductIds(name: string, limit = 1): Promise<{ id: string; similarity: number }[]> {
    const normalizedName = removeAccents(name.trim().toLowerCase());

    const rawResults: ({ id: string } & { sim: number })[] = await this._prisma.$queryRaw<
      { id: string; sim: number }[]
    >(
      Prisma.sql`
      SELECT id, similarity(lower(unaccent(name)), ${normalizedName}) AS sim
      FROM products
      WHERE lower(unaccent(name)) % ${normalizedName}
      ORDER BY sim DESC
      LIMIT ${limit}
      `
    );

    return rawResults.map((result) => ({
      id: result.id,
      similarity: result.sim,
    }));
  }

  async getProductMetadataById(id: string): Promise<ProductMetadataType | null> {
    const product = await this._prisma.product.findUnique({
      where: { id },
      select: this._productSelectMetadata,
    });

    if (!product) return null;

    return {
      ...product,
      price: product.price.toNumber() ?? 0,
      attributes: product.attributes.reduce((acc, attribute) => {
        acc[attribute.attributeKey] = attribute.attributeValue;
        return acc;
      }, {} as Record<string, string>),
    };
  }

  async findProductByApproxName(name: string): Promise<ProductMetadataType | null> {
    const similarProducts = await this.findSimilarProductIds(name, 1);

    if (similarProducts.length === 0) {
      return null;
    }

    return this.getProductMetadataById(similarProducts[0].id);
  }

  async findManyProductByApproxName(name: string, limit = 2): Promise<ProductMetadataType[] | null> {
    const similarProducts = await this.findSimilarProductIds(name, limit);

    if (similarProducts.length === 0) {
      return null;
    }

    return Promise.all(similarProducts.map((product) => this.getProductMetadataById(product.id)));
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
      const products = await this._prisma.product.findMany({
        where: {
          ...(params.brandName && {
            brand: {
              name: {
                contains: params.brandName,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          }),
          ...(params.categoryName && {
            category: {
              name: {
                contains: params.categoryName,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          }),
          ...(params.priceMin && { price: { gte: params.priceMin } }),
          ...(params.priceMax && { price: { lte: params.priceMax } }),
          ...(params.attributesValues && {
            attributes: {
              some: {
                OR: params.attributesValues.map((value) => ({
                  attributeValue: {
                    contains: value,
                    mode: Prisma.QueryMode.insensitive,
                  },
                })),
              },
            },
          }),
          ...(params.productName && {
            name: {
              contains: params.productName,
              mode: Prisma.QueryMode.insensitive,
            },
          }),
        },
        select: this._productSelectMetadata,
        take: 10,
        orderBy: {
          price: 'asc',
        },
      });

      return products.map((product) => ({
        ...product,
        slug: product.name,
        sku: product.code,
        summary: product.shortDescription,
        image: product.productMedias[0]?.media?.url ? [product.productMedias[0].media.url] : null,
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

  private _fullTextSearchQuery(
    productName = '',
    categoryName = '',
    brandName = '',
    priceMin = 0,
    priceMax = 1000000000,
    attributesValues: string[] = []
  ): Prisma.ProductWhereInput {
    const orConditions: Prisma.ProductWhereInput[] = [];

    if (categoryName) {
      orConditions.push({
        category: { name: { contains: categoryName, mode: Prisma.QueryMode.insensitive } },
      });
    }

    if (brandName) {
      orConditions.push({
        brand: { name: { contains: brandName, mode: Prisma.QueryMode.insensitive } },
      });
    }

    if (priceMin !== undefined) {
      orConditions.push({ price: { gte: priceMin } });
    }

    if (priceMax !== undefined) {
      orConditions.push({ price: { lte: priceMax } });
    }

    if (productName) {
      orConditions.push({ name: { contains: productName, mode: Prisma.QueryMode.insensitive } });
    }

    if (attributesValues.length > 0) {
      orConditions.push({
        attributes: {
          some: {
            attributeValue: {
              in: attributesValues,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        },
      });
    }

    return {
      OR: orConditions.filter(Boolean),
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
      orderBy: {
        id: Prisma.SortOrder.asc,
      },
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

// private _fullTextSearchQuery(productName: string ="", categoryName: string ="", brandName: string ="", priceMin: number = 0, priceMax: number = 1000000000, attributesValues: string[] = []): Prisma.ProductWhereInput {
//   const andConditions: Prisma.ProductWhereInput[] = [];

//   if (categoryName) {
//     andConditions.push({
//       category: { name: { contains: categoryName, mode: Prisma.QueryMode.insensitive } },
//     });
//   }

//   if (brandName) {
//     andConditions.push({ brand: { name: { contains: brandName, mode: Prisma.QueryMode.insensitive } } });
//   }

//   if (priceMin != undefined) {
//     andConditions.push({ price: { gte: priceMin } });
//   }

//   if (priceMax != undefined) {
//     andConditions.push({ price: { lte: priceMax } });
//   }

//   const orConditions: Prisma.ProductWhereInput[] = [];

//   if (productName) {
//     orConditions.push({ name: { contains: productName, mode: Prisma.QueryMode.insensitive } });
//   }

//   if (attributesValues) {
//     orConditions.push({
//       attributes: { some: { attributeValue: { in: attributesValues, mode: Prisma.QueryMode.insensitive } } },
//     });
//   }

//   if (orConditions.length > 0) {
//     andConditions.push({ OR: orConditions });
//   }

//   return {
//     AND: andConditions.filter(Boolean),
//   };
// }
