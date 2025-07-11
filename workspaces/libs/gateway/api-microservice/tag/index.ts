import { ServiceContract } from '../../interfaces/ServiceContract';

import * as TagUniqueKey from './unique-key';

export { TagUniqueKey };

export const Contract = new ServiceContract<CommandConfigs>({
  'tag/unique-key/create': {
    request: {
      enrichments: { user: true },
    },
  },
});

export type CommandConfigs = TagUniqueKey.CreateCommand;
