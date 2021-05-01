import { MethodArgumentMetadataKey } from '../../controllers/method-arguments/method-arguments.constants';

export type ArgumentIndices = { [P in MethodArgumentMetadataKey]?: number };
