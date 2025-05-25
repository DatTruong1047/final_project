import { DynamicStructuredTool } from '@langchain/core/tools';
import { ITool } from '../interfaces/tool.interface';

export abstract class BaseTool implements ITool {
  protected abstract name: string;
  protected abstract description: string;
  protected abstract schema: any;

  abstract execute(input: any): Promise<any>;

  getTool(): DynamicStructuredTool {
    return new DynamicStructuredTool({
      name: this.name,
      description: this.description,
      schema: this.schema,
      func: async (input: any) => {
        const result = await this.execute(input);
        return JSON.stringify(result);
      }
    });
  }
} 