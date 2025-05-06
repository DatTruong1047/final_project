// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function binding(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  return {
    configurable: true,
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    get() {
      return originalMethod.bind(this);
    },
  };
}
