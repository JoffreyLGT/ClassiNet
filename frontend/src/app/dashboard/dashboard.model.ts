export interface BasicStats {
  nbUsers: number;
  nbActiveUsers: number;
  nbProducts: number;
  nbProductsCreatedLastMonth: number;
  nbCategories: number;
}

export interface CategoriesRepartitionItem {
  id: number;
  name: string;
  nbProducts: number;
}
