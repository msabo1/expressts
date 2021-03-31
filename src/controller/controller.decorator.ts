import { Constructible } from '../common/types/constructible.type';
import { ControllerMetadataKey } from './controller.constants';

export function Controller(route: string) {
  return function (target: Constructible) {
    Reflect.defineMetadata(ControllerMetadataKey.ROUTE, route, target);
  };
}
