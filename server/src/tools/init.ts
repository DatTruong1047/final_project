import { ToolRegistry } from './registry/tool.registry';
import { ProductSearchTool } from './implementations/product-search.tool';
import ProductService from '@app/services/product.service';
import { OrderCreateTool } from './implementations/order-create.tool';
import { ProductComparisonTool } from './implementations/product-comparison.tool';
import OrderService from '@app/services/order.service';
import UserService from '@app/services/user.service';

export async function initializeTools(
  productService: ProductService,
  orderService: OrderService,
  userService: UserService
): Promise<ToolRegistry> {
  const registry = ToolRegistry.getInstance();

  const productSearchTool = new ProductSearchTool(productService);
  const productCompareTool = new ProductComparisonTool(productService);
  const orderCreateTool = new OrderCreateTool(orderService, userService);

  registry.registerTool(productSearchTool);
  registry.registerTool(productCompareTool);
  registry.registerTool(orderCreateTool);

  return registry;
}
