import { ServiceContract } from '../../interfaces/ServiceContract';

import * as UniqueKey from './unique-key';

export const Contract = new ServiceContract<Command>();

export { UniqueKey };

type Command = UniqueKey.CreateCommand;

Contract.createCommand<UniqueKey.CreateCommand>({
  command: 'tag/unique-key/create',
  request: {
    enrichments: {
      user: true,
    },
  },
});
