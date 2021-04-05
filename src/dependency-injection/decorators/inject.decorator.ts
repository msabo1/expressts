import { DependencyInjectionMetadataKey } from '../dependency-injection.constants';

export function Inject(token: string): ParameterDecorator {
  return function (target: any, key: string | symbol, index: number) {
    const injectTokens: { [P: number]: string } =
      Reflect.getMetadata(DependencyInjectionMetadataKey.INJECT_TOKENS, target, key) || {};
    injectTokens[index] = token;
  };
}
