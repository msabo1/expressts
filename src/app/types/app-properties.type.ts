import { RequestHandler } from 'express';
import { Constructible } from '../../common/types/constructible.type';

export interface AppProperties {
  port: number;
  controllers?: Constructible[];
  useGlobalMiddlewares?: RequestHandler[];
  customProviders?: CustomProvider[];
}

export type CustomProvider = {
  token: string | Constructible;
  instance: any;
};
