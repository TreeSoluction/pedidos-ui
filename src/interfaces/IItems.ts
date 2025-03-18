export interface IItem {
  value: string;
  name: string;
  quantity: number;
  removableIngredients?: string[];
  addableIngredients?: string[];
  removedIngredients?: string[];
  addedIngredients?: string[];
  observation?: string;
}
