import { RequestHandler } from 'express';
import { Constructible } from '../common/types/constructible.type';
import { MiddlewareMetadataKey } from './middleware.constants';

export function UseMiddlewares(...middlewares: RequestHandler[]): ClassDecorator & MethodDecorator {
  return function (target: Constructible | any, key?: string | symbol) {
    if (key) {
      Reflect.defineMetadata(MiddlewareMetadataKey.USE_MIDDLEWARES, middlewares, target, key);
    } else {
      Reflect.defineMetadata(MiddlewareMetadataKey.USE_MIDDLEWARES, middlewares, target);
    }
  };
}
