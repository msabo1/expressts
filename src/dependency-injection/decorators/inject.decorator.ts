import { Constructible } from '../../common/types/constructible.type';

export function Inject(token: string) {
  return function (target: Constructible, index: number) {
    const injectTokens: { [P: number]: string } = Reflect.getMetadata('injectTokens', target) || {};
    injectTokens[index] = token;
  };
}
