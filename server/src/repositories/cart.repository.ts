import { CartBaseType, CartDetailType, CartUpsertRequestType, CartListType, CartCheckType } from '@model';
import { Cart, Prisma, PrismaClient } from 'generated/prisma';

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
      const itemTotalPrice = cart.quantity * Number(cart.product.price);

      return {
        ...cart,
        product: {
          ...cart.product,
          price: Number(cart.product.price),
          thumbnail: {
            id: cart.product.productMedias[0]?.id || '',
            media: cart.product.productMedias[0]?.media
              ? {
                  id: cart.product.productMedias[0].media.id,
                  url: cart.product.productMedias[0].media.url,
                  description: cart.product.productMedias[0].media.description,
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
    return {
      ...cart,
      product: {
        ...cart.product,
        price: Number(cart.product.price),
        thumbnail: {
          id: cart.product.productMedias[0]?.id || '',
          media: cart.product.productMedias[0]?.media
            ? {
                id: cart.product.productMedias[0].media.id,
                url: cart.product.productMedias[0].media.url,
                description: cart.product.productMedias[0].media.description,
              }
            : null,
        },
      },
      totalPrice: cart.quantity * Number(cart.product.price),
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
    } catch {
      return false;
    }
  }

  async deleteCart(cartId: string, userId: string): Promise<boolean> {
    try {
      await this._prisma.cart.delete({
        where: { id: cartId, userId },
      });

      return true;
    } catch {
      return false;
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
    } catch {
      return false;
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
