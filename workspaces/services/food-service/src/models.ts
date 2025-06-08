export namespace Models {
  export type Nutrients = {
    calories: number;
    proteins: number;
    fats: number;
    carbs: number;
    fibers: number;
  };

  export type Product = {
    name: string;
    nutrients: Nutrients;
  };
}
