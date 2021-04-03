import express, { Request, Response } from 'express';
import { Constructible } from '../common/types/constructible.type';
import { ControllerMetadataKey } from '../controller/controller.constants';
import { DependencyContainer } from '../dependency-injection/dependency.container';
import { HttpMethod } from '../http-methods/http-method.enum';
import { HttpMethodMetadataKey } from '../http-methods/http-methods.constants';
import { Logger } from '../logger/logger';
import { MethodArgumentMetadataKey } from '../method-arguments/method-arguments.constants';
import { AppProperties } from './types/app-properties.type';
import { ArgumentIndices } from './types/argument-indices.type';

export class BootstrapService {
  private readonly expressApp: express.Express;
  private readonly logger: Logger;
  constructor(
    private readonly appClass: Constructible,
    private readonly appProperties: AppProperties,
  ) {
    this.expressApp = express();
    this.logger = DependencyContainer.get(Logger);
  }

  bootstrap() {
    this.expressApp.use(express.json());
    if (this.appProperties.controllers) {
      this.registerControllers(this.appProperties.controllers);
    }
    this.expressApp.listen(this.appProperties.port);
  }

  private registerControllers(controllers: Constructible[]) {
    controllers.forEach((controller: Constructible) => {
      this.registerController(controller);
    });
  }

  private registerController(controllerClass: Constructible) {
    const controller: any = DependencyContainer.get(controllerClass);
    const route: string = Reflect.getMetadata(ControllerMetadataKey.ROUTE, controllerClass);
    const keys: string[] = Object.keys(controllerClass.prototype);
    keys.forEach((key: string) => {
      const method: HttpMethod = Reflect.getMetadata(
        HttpMethodMetadataKey.METHOD,
        controllerClass.prototype,
        key,
      );
      const path: string =
        Reflect.getMetadata(HttpMethodMetadataKey.PATH, controllerClass.prototype, key) || '';
      if (method) {
        const argumentIndices: ArgumentIndices = this.getArgumentIndices(
          controllerClass.prototype,
          key,
        );
        const handler: Function = controller[key].bind(controller);
        const fullPath: string = `${route}${path}`;
        this.registerHandler(method, fullPath, handler, argumentIndices);
        this.logger.info(`Mapped ${method.toUpperCase()} ${fullPath}`);
      }
    });
  }

  private registerHandler(
    method: HttpMethod,
    path: string,
    handler: Function,
    argumentIndices: ArgumentIndices,
  ) {
    this.expressApp[method](path, async (req: Request, res: Response) => {
      const args: any[] = [];
      if (argumentIndices[MethodArgumentMetadataKey.BODY] != null) {
        args[argumentIndices[MethodArgumentMetadataKey.BODY] as number] = req.body;
      }
      if (argumentIndices[MethodArgumentMetadataKey.QUERY] != null) {
        args[argumentIndices[MethodArgumentMetadataKey.QUERY] as number] = req.query;
      }
      if (argumentIndices[MethodArgumentMetadataKey.PARAMS] != null) {
        args[argumentIndices[MethodArgumentMetadataKey.PARAMS] as number] = req.params;
      }
      if (argumentIndices[MethodArgumentMetadataKey.REQUEST] != null) {
        args[argumentIndices[MethodArgumentMetadataKey.REQUEST] as number] = req;
      }
      const response: any = await handler(...args);
      res.send(response);
    });
  }

  private getArgumentIndices(target: any, methodKey: string): ArgumentIndices {
    const indices: ArgumentIndices = {};
    Object.values(MethodArgumentMetadataKey).forEach((key: string) => {
      indices[key as MethodArgumentMetadataKey] = Reflect.getMetadata(key, target, methodKey);
    });
    return indices;
  }
}
