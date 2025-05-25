import { DynamicStructuredTool } from '@langchain/core/tools';
import { ITool } from '../interfaces/tool.interface';

export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools: Map<string, DynamicStructuredTool> = new Map();

  private constructor() {}

  static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  registerTool(tool: ITool) {
    const toolInstance = tool.getTool();
    this.tools.set(toolInstance.name, toolInstance);
  }

  getTool(name: string): DynamicStructuredTool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): DynamicStructuredTool[] {
    return Array.from(this.tools.values());
  }
} 