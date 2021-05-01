import { Headers } from './headers.type';
import { ResponseHeadersMetadataKey } from './response-headers.constants';

export function ResponseHeaders(headers: Headers): ClassDecorator & MethodDecorator {
  return function (target: any, key?: string | symbol) {
    if (key) {
      Reflect.defineMetadata(ResponseHeadersMetadataKey.HEADERS, headers, target, key);
    } else {
      Reflect.defineMetadata(ResponseHeadersMetadataKey.HEADERS, headers, target);
    }
  };
}
