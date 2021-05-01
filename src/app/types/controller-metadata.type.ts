import { RequestHandler } from 'express';
import { Headers } from '../../controllers/response-headers/headers.type';

export interface ControllerMetadata {
  route: string;
  middlewares?: RequestHandler[];
  defaultHttpStatus?: number;
  headers?: Headers;
}
