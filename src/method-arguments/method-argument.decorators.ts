import { argumentDecoratorFactory } from './argument-decorator.factory';
import { MethodArgumentMetadataKey } from './method-arguments.constants';

export const RequestBody = argumentDecoratorFactory(MethodArgumentMetadataKey.BODY);
export const RequestParams = argumentDecoratorFactory(MethodArgumentMetadataKey.PARAMS);
export const RequestQuery = argumentDecoratorFactory(MethodArgumentMetadataKey.QUERY);
export const Request = argumentDecoratorFactory(MethodArgumentMetadataKey.REQUEST);
