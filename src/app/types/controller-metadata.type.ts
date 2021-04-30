import { RequestHandler } from 'express';

export interface ControllerMetadata {
  route: string;
  middlewares?: RequestHandler[];
  defaultHttpStatus?: number;
}
