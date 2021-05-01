import { RequestHandler } from 'express';
import { HttpMethod } from '../../controllers/http-methods/http-method.enum';
import { Headers } from '../../controllers/response-headers/headers.type';
import { ArgumentIndices } from './argument-indices.type';

export interface MethodMetadata {
  httpMethod: HttpMethod;
  path: string;
  argumentIndices: ArgumentIndices;
  middlewares?: RequestHandler[];
  defaultHttpStatus?: number;
  headers?: Headers;
}
