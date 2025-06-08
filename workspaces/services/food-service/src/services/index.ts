import * as ProductService from './product';
import * as NutrientsService from './nutrients';

export namespace Services {
  export const Product = ProductService;
  export const Nutrients = NutrientsService;
}
