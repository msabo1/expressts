import { Constructible } from '../../common/types/constructible.type';

export type Token<T = any> = string | Constructible<T>;
