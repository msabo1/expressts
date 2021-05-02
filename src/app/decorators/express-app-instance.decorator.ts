import { Inject } from '../../dependency-injection';
import { AppProviderToken } from '../app.constants';

export function ExpressAppInstance(): ParameterDecorator {
  return Inject(AppProviderToken.EXPRESS_APP_INSTANCE);
}
