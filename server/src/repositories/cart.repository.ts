import { CartDetailType, CartUpsertRequestType, CartListType, CartCheckType } from '@model';
import { Prisma, PrismaClient } from 'generated/prisma';

import prisma from '@app/lib/prisma';

export default class CartRepository {
  private readonly _prisma: PrismaClient;

  constructor() {
    this._prisma = prisma;
  }

  async getCartsByUserId(userId: string): Promise<CartListType> {
    const where: Prisma.CartWhereInput = {
      userId,
    };

    const [carts, totalCount] = await this._prisma.$transaction([
      this._prisma.cart.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        select: this._cartSelectBase,
      }),
      this._prisma.cart.count({
        where,
      }),
    ]);

    const cartsWithTotalPrice = carts.map((cart) => {
      const productPrice = Number(cart.product.price);
      const itemTotalPrice = cart.quantity * productPrice;
      const productThumbnail = cart.product.productMedias[0]?.media;

      return {
        ...cart,
        product: {
          ...cart.product,
          price: productPrice,
          thumbnail: {
            id: productThumbnail?.id || '',
            media: productThumbnail
              ? {
                  id: productThumbnail.id,
                  url: productThumbnail.url,
                  description: productThumbnail.description,
                }
              : null,
          },
        },
        totalPrice: itemTotalPrice,
      };
    });

    const cartTotalPrice = cartsWithTotalPrice.reduce((sum, cart) => sum + cart.totalPrice, 0);

    return {
      carts: cartsWithTotalPrice,
      total: totalCount,
      totalPrice: cartTotalPrice,
    };
  }

  async getCartById(cartId: string, userId: string): Promise<CartDetailType> {
    const cart = await this._prisma.cart.findUnique({
      where: { id: cartId, userId },
      select: this._cartSelectBase,
    });

    if (!cart) {
      throw new Error('Cart not found');
    }
    const productPrice = Number(cart.product.price);
    const itemTotalPrice = cart.quantity * productPrice;
    const productThumbnail = cart.product.productMedias[0]?.media;

    return {
      ...cart,
      product: {
        ...cart.product,
        price: productPrice,
        thumbnail: {
          id: productThumbnail?.id || '',
          media: productThumbnail
            ? {
                id: productThumbnail.id,
                url: productThumbnail.url,
                description: productThumbnail.description,
              }
            : null,
        },
      },
      totalPrice: itemTotalPrice,
    };
  }

  async getCartsByIds(cartIds: string[], userId: string): Promise<CartListType> {
    const [carts, totalCount] = await this._prisma.$transaction([
      this._prisma.cart.findMany({
        where: { id: { in: cartIds }, userId },
        select: {
          id: true,
          quantity: true,
          product: {
            select: {
              id: true,
              price: true,
              quantity: true,
              name: true,
            },
          },
        },
      }),
      this._prisma.cart.count({
        where: { id: { in: cartIds }, userId },
      }),
    ]);

    const cartsWithTotalPrice = carts.map((cart) => {
      const productPrice = Number(cart.product.price);
      const itemTotalPrice = cart.quantity * productPrice;

      return {
        ...cart,
        product: {
          ...cart.product,
          price: productPrice,
        },
        totalPrice: itemTotalPrice,
      };
    });

    const cartTotalPrice = cartsWithTotalPrice.reduce((sum, cart) => sum + cart.totalPrice, 0);

    return {
      carts: cartsWithTotalPrice,
      total: totalCount,
      totalPrice: cartTotalPrice,
    };
  }

  async getCartWithProductIdAndUserId(productId: string, userId: string): Promise<CartCheckType | null> {
    const cart = await this._prisma.cart.findFirst({
      where: { productId, userId },
      select: {
        id: true,
        quantity: true,
      },
    });

    if (!cart) {
      return null;
    }
    return { id: cart.id, quantity: cart.quantity };
  }

  async createCart(cart: CartUpsertRequestType, userId: string): Promise<boolean> {
    try {
      await this._prisma.cart.create({
        data: {
          productId: cart.productId,
          quantity: cart.quantity,
          userId: userId,
        },
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to create cart: ${error.message}`);
    }
  }

  async deleteCart(cartId: string, userId: string): Promise<boolean> {
    try {
      await this._prisma.cart.delete({
        where: { id: cartId, userId },
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to delete cart: ${error.message}`);
    }
  }

  async updateCart(cartId: string, quantity: number, userId: string): Promise<boolean> {
    try {
      await this._prisma.cart.update({
        where: { id: cartId, userId },
        data: {
          quantity: quantity,
        },
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to update cart: ${error.message}`);
    }
  }

  async deleteManyCart(cartIds: string[]): Promise<boolean> {
    try {
      await this._prisma.cart.deleteMany({
        where: { id: { in: cartIds } },
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete carts: ${error.message}`);
    }
  }

  private readonly _cartSelectBase = {
    id: true,
    productId: true,
    quantity: true,
    userId: true,
    product: {
      select: {
        id: true,
        name: true,
        code: true,
        price: true,
        quantity: true,
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
      },
    },
  };
}
