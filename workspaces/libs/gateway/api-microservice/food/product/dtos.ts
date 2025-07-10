import { FoodDomain } from '@libs/domain';

export type ProductDTO = {
  id: FoodDomain.Product['id'];
  name: FoodDomain.Product['name'];
  nutrients: Pick<
    FoodDomain.Nutrients,
    'calories' | 'carbs' | 'fats' | 'fibers' | 'proteins'
  >;
};
