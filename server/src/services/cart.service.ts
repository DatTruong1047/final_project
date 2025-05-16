import { CartListType, CartUpsertRequestType, ResultType } from '@model';

import { ErrorCodes } from '@app/config';
import ProductRepository from '@app/repositories/product.repository';

import CartRepository from '@repository/cart.repository';

export default class CartService {
  private readonly _cartRepository: CartRepository;
  private readonly _productRepository: ProductRepository;

  constructor() {
    this._cartRepository = new CartRepository();
    this._productRepository = new ProductRepository();
  }

  async getUserCarts(userId: string): Promise<ResultType<CartListType>> {
    try {
      const result = await this._cartRepository.getCartsByUserId(userId);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        code: ErrorCodes.GET_CART_LIST_FAILED,
        message: error.message || 'Get cart list failed',
      };
    }
  }

  async upSertCart(upSertCart: CartUpsertRequestType, userId: string): Promise<ResultType<boolean>> {
    try {
      const existCart = await this._cartRepository.getCartWithProductIdAndUserId(upSertCart.productId, userId);
      let result = false;

      const newQuantity = existCart ? existCart.quantity + upSertCart.quantity : upSertCart.quantity;

      const product = await this._productRepository.getProductById(upSertCart.productId);

      if (!product) {
        return {
          success: false,
          code: ErrorCodes.PRODUCT_NOT_FOUND,
          message: 'Product not found',
        };
      }

      if (newQuantity > product.quantity) {
        return {
          success: false,
          code: ErrorCodes.QUANTITY_IS_NOT_ENOUGH,
          message: 'Quantity is not enough',
        };
      }

      if (existCart) {
        result = await this._cartRepository.updateCart(existCart.id, newQuantity, userId);
      } else {
        result = await this._cartRepository.createCart(upSertCart, userId);
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        code: ErrorCodes.ADD_TO_CART_FAILED,
        message: error.message || 'Add to cart failed',
      };
    }
  }

  async updateCartQuantity(cartId: string, count: number, userId: string): Promise<ResultType<boolean>> {
    try {
      const cart = await this._cartRepository.getCartById(cartId, userId);
      if (!cart) {
        return {
          success: false,
          code: ErrorCodes.CART_NOT_FOUND,
          message: 'Cart not found',
        };
      }

      if (!cart.product) {
        return {
          success: false,
          code: ErrorCodes.PRODUCT_NOT_FOUND,
          message: 'Product not found',
        };
      }

      if (count > cart.product.quantity) {
        return {
          success: false,
          code: ErrorCodes.QUANTITY_IS_NOT_ENOUGH,
          message: 'Quantity is not enough',
        };
      }

      if (count <= 0) {
        await this._cartRepository.deleteCart(cartId, userId);
        return {
          success: true,
          data: true,
        };
      }

      const result = await this._cartRepository.updateCart(cartId, count, userId);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        code: ErrorCodes.UPDATE_CART_FAILED,
        message: error.message || 'Update cart failed',
      };
    }
  }

  async deleteCart(cartId: string, userId: string): Promise<ResultType<boolean>> {
    try {
      const result = await this._cartRepository.deleteCart(cartId, userId);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        code: ErrorCodes.DELETE_CART_FAILED,
        message: error.message || 'Delete cart failed',
      };
    }
  }
}
