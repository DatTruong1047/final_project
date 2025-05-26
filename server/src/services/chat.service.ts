import { Document } from '@langchain/core/documents';
import { MessageContent } from '@langchain/core/messages';

import app from '@app/app';

import {
  ProductComparisonInputType,
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


  async sendMessage(query: string): Promise<ResultType<MessageContent>> {
    try {
      const res = await this._geminiService.generateResponse(query);
      return res;
    } catch (error) {
      app.log.error('Error in sendMessage:', error);
      throw new Error('Server error');
    }
  }

}
