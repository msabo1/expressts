export function Inject(token: string): ParameterDecorator {
  return function (target: any, key: string | symbol, index: number) {
    const injectTokens: { [P: number]: string } =
      Reflect.getMetadata('injectTokens', target, key) || {};
    injectTokens[index] = token;
  };
}
