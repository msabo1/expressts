import { Dependency } from './types/dependency.type';
import { Token } from './types/token.type';

export class DependencyContainer {
  private static readonly dependencies: Dependency[] = [];

  static get<T = any>(token: Token<T>): T {
    let dependency: Dependency<T> | undefined = DependencyContainer.dependencies.find(
      (dependency: Dependency) => dependency.token === token,
    );
    if (!dependency) {
      if (typeof token === 'string') {
        throw 'Unknown token identifier!';
      }
      const constructorParamTypes: any[] = Reflect.getMetadata('design:paramtypes', token);
      const constructorParamInstances: any[] = [];
      for (const i in constructorParamTypes) {
        let injectToken: Token = constructorParamTypes[i];
        if (typeof injectToken === 'object') {
          injectToken = Reflect.getMetadata('injectTokens', token)[i];
          if (!injectToken) {
            throw `Cannot resolve dependency of ${token} at index ${i}`;
          }
        }
        constructorParamInstances.push(DependencyContainer.get(injectToken));
      }
      dependency = { token, instance: new token(constructorParamInstances) };
    }
    DependencyContainer.dependencies.push(dependency);
    return dependency.instance;
  }
}
