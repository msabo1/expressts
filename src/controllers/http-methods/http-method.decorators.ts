import { httpMethodDecoratorFactory } from './http-method-decorator.factory';
import { HttpMethod } from './http-method.enum';

export const Get = httpMethodDecoratorFactory(HttpMethod.Get);
export const Head = httpMethodDecoratorFactory(HttpMethod.Head);
export const Post = httpMethodDecoratorFactory(HttpMethod.Post);
export const Put = httpMethodDecoratorFactory(HttpMethod.Put);
export const Delete = httpMethodDecoratorFactory(HttpMethod.Delete);
export const Connect = httpMethodDecoratorFactory(HttpMethod.Connect);
export const Options = httpMethodDecoratorFactory(HttpMethod.Options);
export const Trace = httpMethodDecoratorFactory(HttpMethod.Trace);
export const Patch = httpMethodDecoratorFactory(HttpMethod.Patch);
