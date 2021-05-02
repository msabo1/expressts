import 'reflect-metadata';
import { BootstrapService } from '../bootstrap.service';
import { AppProperties } from '../types/app-properties.type';

export function App(properties: AppProperties): ClassDecorator {
  return function (target: any) {
    const bootstrapService: BootstrapService = new BootstrapService(target, properties);
    bootstrapService.bootstrap();
  };
}
