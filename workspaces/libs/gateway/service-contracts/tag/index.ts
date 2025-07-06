import { ServiceContract } from '../../interfaces/ServiceContract';

import * as TagUniqueKey from './unique-key';

export { TagUniqueKey };

export const TagContract = new ServiceContract<TagCommandConfig>({
  'tag/unique-key/create': {
    request: { enrichments: { user: true } },
  },
});

export type TagCommandConfig = TagUniqueKey.CreateCommand;
