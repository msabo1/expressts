import { DependencyContainer } from '../dependency.container';
import { InjectableOptions } from '../types/injectable-options.type';

export function Injectable(injectableOptions?: InjectableOptions): ClassDecorator {
  return function (target: any) {
    if (injectableOptions?.singleton === false) {
      DependencyContainer.registerClassTokenDependency(target);
    }
  };
}
