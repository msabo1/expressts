import { DefaultHttpStatusMetadataKey } from './default-http-status.constants';

export function DefaultHttpStatus(status: number): ClassDecorator & MethodDecorator {
  return function (target: any, key?: string | symbol) {
    if (key) {
      Reflect.defineMetadata(DefaultHttpStatusMetadataKey.DEFAULT_HTTP_STATUS, status, target, key);
    } else {
      Reflect.defineMetadata(DefaultHttpStatusMetadataKey.DEFAULT_HTTP_STATUS, status, target);
    }
  };
}
