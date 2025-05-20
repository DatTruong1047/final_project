import { MessageContent } from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

import { ErrorCodes, geminiApiKey, geminiModel } from '@config';

import { ResultType } from '@app/models';

export class GeminiServiceError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

export default class GeminiService {
  private readonly _genai: ChatGoogleGenerativeAI;

  constructor() {
    if (!geminiApiKey) {
      throw new GeminiServiceError('Gemini API key is not configured', 'CONFIG_ERROR');
    }

    this._genai = new ChatGoogleGenerativeAI({
      apiKey: geminiApiKey,
      model: geminiModel,
    });
  }

  async generateResponse(query: string): Promise<ResultType<MessageContent>> {
    try {
      const response = await this._genai.invoke(query);

      if (!response || !response.content) {
        return {
          code: ErrorCodes.EMPTY_RESPONSE,
          success: false,
          message: 'Empty response from Gemini API',
          data: null,
        };
      }

      return {
        code: 200,
        success: true,
        message: 'Success',
        data: response.content,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          return {
            code: ErrorCodes.INVALID_API_KEY,
            success: false,
            message: 'Invalid Gemini API key',
            data: null,
          };
        }
        if (error.message.includes('rate limit')) {
          return {
            code: ErrorCodes.RATE_LIMIT,
            success: false,
            message: 'Rate limit exceeded for Gemini API',
            data: null,
          };
        }
        if (error.message.includes('quota')) {
          return {
            code: ErrorCodes.QUOTA_EXCEEDED,
            success: false,
            message: 'Quota exceeded for Gemini API',
            data: null,
          };
        }
      }
      if (!(error instanceof GeminiServiceError)) {
        throw error;
      }
    }
  }
}
