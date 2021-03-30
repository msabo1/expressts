import { Constructible } from '../../common/types/constructible.type';

export function Injectable() {
  return function (target: Constructible) {};
}
