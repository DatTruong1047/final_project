import { Document } from '@langchain/core/documents';
import { MessageContent } from '@langchain/core/messages';

import app from '@app/app';
import {
  CreateOrderResultType,
  CreateOrderWithChatSchema,
  CreateOrderWithChatType,
  OrderResponseType,
  ProductListType,
  ProductMetadataType,
  ProductSearchQueryType,
  ResultType,
  SuccessResponseType,
} from '@app/models';
import VectorStore from '@app/vector-store/init';

import GeminiService from '@services/gemini.service';
import ProductService from './product.service';
import { mapProductDocumentToMetadata } from '@app/utils/mapper/product.mapper';
import OrderService from './order.service';
import UserService from './user.service';
import { createPaymentIntent } from '@app/utils/stripe';
import { OrderStatusEnum } from 'generated/prisma';

export default class ChatService {
  private readonly _geminiService: GeminiService;
  private readonly _productService: ProductService;
  private readonly _orderService: OrderService;
  private readonly _userService: UserService;

  constructor(
    geminiService: GeminiService,
    productService: ProductService,
    orderService: OrderService,
    userService: UserService
  ) {
    this._geminiService = geminiService;
    this._productService = productService;
    this._orderService = orderService;
    this._userService = userService;
  }

  async search(query: string): Promise<Document[]> {
    const vectorStore = await VectorStore.getInstance();
    const result = await vectorStore.similaritySearch(query);
    return result;
  }

  async productSearch(query: ProductSearchQueryType): Promise<ResultType<ProductListType>> {
    try {
      const { query: searchText, ...fullTextQuery } = query;

      let fullTextData: ProductMetadataType[] = [];
      let similarityData: ProductMetadataType[] = [];

      let fullTextResult = await this._productService.fullTextSearch(fullTextQuery);

      fullTextData = fullTextResult.data || [];

      const similarityResult = await this.search(searchText);

      if (similarityResult.length > 0) {
        similarityData = similarityResult.map((item) => mapProductDocumentToMetadata(item));
      }

      // Remove duplicate products based on a unique SKU
      const uniqueProducts = new Map<string, ProductMetadataType>();
      [...fullTextData, ...similarityData].forEach((product) => {
        uniqueProducts.set(product.sku, product);
      });

      const products = Array.from(uniqueProducts.values());
      const total = products.length;
      return {
        code: 200,
        message: 'Product search successful',
        success: true,
        data: {
          products,
          total,
        },
      };
    } catch (error) {
      app.log.error('Error in productSearch:', error);
      throw error;
    }
  }

  async sendMessage(query: string): Promise<ResultType<MessageContent>> {
    try {
      const res = await this._geminiService.generateResponse(query);
      return res;
    } catch (error) {
      app.log.error('Error in sendMessage:', error);
      throw new Error('Server error');
    }
  }

  async createOrderWithChat(query: CreateOrderWithChatType): Promise<ResultType<OrderResponseType>> {
    try {
      const user = await this._userService.getUserById(query.userId);
      if (!user) {
        return {
          code: 401,
          message: 'User not found',
          success: false,
        };
      }

      const createOrderResult = await this._orderService.createOrderWithChat(query);

      if (!createOrderResult.success) {
        return {
          code: createOrderResult.code,
          message: createOrderResult.message,
          success: false,
        };
      }

      const paymentIntent = await createPaymentIntent(
        Number(createOrderResult.data.totalAmount),
        createOrderResult.data.id,
        user.id
      );
      await this._orderService.updateOrderStatus(createOrderResult.data.id, OrderStatusEnum.PROCESSING);
      await this._orderService.addPaymentIntentId(createOrderResult.data.id, paymentIntent.id);

      const responseData: OrderResponseType = {
        ...createOrderResult.data,
        paymentIntent: {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret as string,
        },
      };

      return {
        code: 200,
        message: 'Order created successfully',
        success: true,
        data: responseData,
      };
    } catch (error) {
      app.log.error('Error in createOrder:', error);
      throw error;
    }
  }
}
