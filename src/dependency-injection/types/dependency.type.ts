import { Token } from './token.type';

export interface Dependency<T = any> {
  token: Token<T>;
  instance: T;
}
