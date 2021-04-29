import express, { Request, RequestHandler, Response, Router } from 'express';
import { Constructible } from '../common/types/constructible.type';
import { ControllerMetadataKey } from '../controller/controller.constants';
import { DependencyContainer } from '../dependency-injection/dependency.container';
import { HttpMethod } from '../http-methods/http-method.enum';
import { HttpMethodMetadataKey } from '../http-methods/http-methods.constants';
import { Logger } from '../logger/logger';
import { MethodArgumentMetadataKey } from '../method-arguments/method-arguments.constants';
import { MiddlewareMetadataKey } from '../middleware/middleware.constants';
import { AppProperties, CustomProvider } from './types/app-properties.type';
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
    this.appProperties.useGlobalMiddlewares?.forEach((middleware: RequestHandler) => {
      this.expressApp.use(middleware);
    });
    if (this.appProperties.customProviders) {
      this.registerCustomProviders(this.appProperties.customProviders);
    }
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

  private registerCustomProviders(providers: CustomProvider[]) {
    providers.forEach((provider: CustomProvider) => {
      if (typeof provider.token === 'string') {
        DependencyContainer.registerStringTokenDependency(provider.token, provider.instance);
      } else {
        DependencyContainer.registerClassTokenDependency(provider.token, provider.instance);
      }
    });
  }

  private registerController(controllerClass: Constructible) {
    const controller: any = DependencyContainer.get(controllerClass);
    const route: string = Reflect.getMetadata(ControllerMetadataKey.ROUTE, controllerClass);
    const keys: string[] = Object.keys(controllerClass.prototype);
    const router: Router = express.Router();
    const middlewares: RequestHandler[] = Reflect.getMetadata(
      MiddlewareMetadataKey.USE_MIDDLEWARES,
      controllerClass,
    );
    if (middlewares) {
      router.use(middlewares);
    }
    keys.forEach((key: string) => {
      const method: HttpMethod = Reflect.getMetadata(
        HttpMethodMetadataKey.METHOD,
        controllerClass.prototype,
        key,
      );
      const path: string =
        Reflect.getMetadata(HttpMethodMetadataKey.PATH, controllerClass.prototype, key) || '';
      if (method) {
        const methodMiddlewares: RequestHandler[] =
          Reflect.getMetadata(
            MiddlewareMetadataKey.USE_MIDDLEWARES,
            controllerClass.prototype,
            key,
          ) || [];
        const argumentIndices: ArgumentIndices = this.getArgumentIndices(
          controllerClass.prototype,
          key,
        );
        const handler: Function = controller[key].bind(controller);
        this.registerHandler(router, method, path, methodMiddlewares, handler, argumentIndices);
        this.logger.info(`Mapped ${method.toUpperCase()} ${route}${path}`);
      }
    });
    this.expressApp.use(route, router);
  }

  private registerHandler(
    router: Router,
    method: HttpMethod,
    path: string,
    middlewares: RequestHandler[],
    handler: Function,
    argumentIndices: ArgumentIndices,
  ) {
    const expressHandler: RequestHandler = async (req: Request, res: Response) => {
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
      if (argumentIndices[MethodArgumentMetadataKey.RESPONSE] != null) {
        args[argumentIndices[MethodArgumentMetadataKey.RESPONSE] as number] = res;
      }
      const response: any = await handler(...args);
      res.send(response);
    };
    const handlers: RequestHandler[] = [...middlewares, expressHandler];
    router[method](path, ...handlers);
  }

  private getArgumentIndices(target: any, methodKey: string): ArgumentIndices {
    const indices: ArgumentIndices = {};
    Object.values(MethodArgumentMetadataKey).forEach((key: string) => {
      indices[key as MethodArgumentMetadataKey] = Reflect.getMetadata(key, target, methodKey);
    });
    return indices;
  }
}
