import { ICommandContract, Exception } from '../../interfaces';

type ItemType = 'food/product';

export type DTO = {
  id: string;
  userId: string;
  itemType: ItemType;
};

export class KeyNotUniqueException extends Exception<
  'tag/unique-key/key-not-unique',
  null
> {
  constructor(arg: { key: string }) {
    super({
      type: 'tag/unique-key/key-not-unique',
      status: 400,
      message: `Key '${arg.key}' already exists`,
      details: null,
    });
  }
}

export type CreateCommand = ICommandContract<{
  command: 'tag/unique-key/create';
  request: {
    data: {
      itemType: ItemType;
      itemId: string;
      key: string;
    };
    enrichments: {
      user: true;
    };
  };
  response: {
    data: DTO;
  };
  exceptions: KeyNotUniqueException;
}>;
