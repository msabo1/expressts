export function argumentDecoratorFactory(metadataKey: string) {
  return function () {
    return function (target: any, key: string, index: number) {
      Reflect.defineMetadata(metadataKey, index, target, key);
    };
  };
}
