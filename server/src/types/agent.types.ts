import { AgentResultType } from '@app/models';
import { BaseMessage } from '@langchain/core/messages';

export interface AgentInvokeResult {
  output: string;
  intermediateSteps: any[];
}

export interface AgentWithInvoke {
  invoke: (input: any) => Promise<AgentInvokeResult>;
}

export class GeminiServiceError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

export type ResultType<T> = {
  code: number;
  success: boolean;
  message: string;
  data: T;
};

export interface AgentState {
  messages: BaseMessage[];
  agent_history: BaseMessage[];
  next: string;
}

export interface AgentExecutionResult {
  isFinal: boolean;
  data?: AgentResultType;
  newState?: AgentState;
}