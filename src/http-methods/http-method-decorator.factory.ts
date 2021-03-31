import { HttpMethod } from './http-method.enum';
import { HttpMethodMetadataKey } from './http-methods.constants';

export function httpMethodDecoratorFactory(method: HttpMethod) {
  return function (path?: string) {
    return function (target: any, key: string) {
      Reflect.defineMetadata(HttpMethodMetadataKey.METHOD, method, target, key);
      Reflect.defineMetadata(HttpMethodMetadataKey.PATH, path, target, key);
    };
  };
}
