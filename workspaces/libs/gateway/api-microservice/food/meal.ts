import { ICommandContract } from '../../interfaces';
import * as Product from './product';

export type DTO = {
  id: string;
  datetime: string;
  grams: number;
  productId: string;
};

export type CreateCommand = ICommandContract<{
  command: 'food/meal/create';
  request: {
    data: {
      datetime?: string;
      productId: string;
      grams: number;
    };
    enrichments: {
      user: true;
    };
  };
  response: {
    data: DTO;
  };
  exceptions: Product.NotFoundException;
}>;
