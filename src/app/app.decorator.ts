import 'reflect-metadata';
import { Constructible } from '../common/types/constructible.type';
import { BootstrapService } from './bootstrap.service';
import { AppProperties } from './types/app-properties.type';

export function App(properties: AppProperties) {
  return function (target: Constructible) {
    const bootstrapService: BootstrapService = new BootstrapService(target, properties);
    bootstrapService.bootstrap();
  };
}
