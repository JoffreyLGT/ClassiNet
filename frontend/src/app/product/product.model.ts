export interface ProductModel {
  id: number;
  designation: string;
  description?: string;
  category?: Category;
}

export interface GetProductListResponse {
  nbTotalProducts: number;
  nbPages: number;
  data: ProductModel[];
}

export interface Category {
  id: string;
  name: string;
}
