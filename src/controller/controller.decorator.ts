import { Constructible } from '../common/types/constructible.type';

export function Controller(route: string) {
  return function (target: Constructible) {
    Reflect.defineMetadata('route', route, target);
  };
}
