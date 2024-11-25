export interface BasicStats {
  nbUsers: number;
  nbActiveUsers: number;
  nbProducts: number;
  nbProductsCreatedLastMonth: number;
  nbCategories: number;
}

export interface CategoriesDistributionItem {
  id: number;
  name: string;
  nbProducts: number;
  percentage: number;
}
