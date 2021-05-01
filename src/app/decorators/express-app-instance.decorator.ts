import { AppMetadataKey } from '../app.constants';

export function ExpressAppInstance(): PropertyDecorator {
  return function (target: any, key: string | symbol) {
    Reflect.defineMetadata(AppMetadataKey.EXPRESS_APP_INSTANCE, key, target);
  };
}
