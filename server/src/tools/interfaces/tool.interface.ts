import { DynamicStructuredTool } from '@langchain/core/tools';

export interface ITool {
  getTool(): DynamicStructuredTool;
}