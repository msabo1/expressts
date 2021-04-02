import { argumentDecoratorFactory } from './argument-decorator.factory';
import { MethodArgumentMetadataKey } from './method-arguments.constants';

export const Body = argumentDecoratorFactory(MethodArgumentMetadataKey.BODY);
export const Params = argumentDecoratorFactory(MethodArgumentMetadataKey.PARAMS);
export const Query = argumentDecoratorFactory(MethodArgumentMetadataKey.QUERY);
export const Req = argumentDecoratorFactory(MethodArgumentMetadataKey.REQUEST);
