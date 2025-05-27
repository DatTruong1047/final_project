import { z } from 'zod';
import { BaseMessage } from '@langchain/core/messages';

export const ChatInputSchema = z.object({
  sessionId: z.string(),
  message: z.string(),
  userId: z.string().optional(),
  anonymousId: z.string().optional(),
});

export const ChatOutputSchema = z.object({
  message: z.string(),
  toolCalls: z.array(z.object({
    name: z.string(),
    arguments: z.record(z.any()),
  })).optional(),
  metadata: z.record(z.any()).optional(),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export interface ChatHistory {
  messages: BaseMessage[];
  metadata?: Record<string, any>;
}

export interface ToolCall {
  name: string;
  arguments: Record<string, any>;
  result?: any;
}

export interface ChatMetadata {
  sessionId: string;
  userId?: string;
  anonymousId?: string;
  startTime: Date;
  lastInteraction: Date;
  toolCalls: ToolCall[];
} 