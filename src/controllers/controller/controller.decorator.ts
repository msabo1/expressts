import { ControllerMetadataKey } from './controller.constants';

export function Controller(route: string): ClassDecorator {
  return function (target: any) {
    Reflect.defineMetadata(ControllerMetadataKey.ROUTE, route, target);
  };
}
