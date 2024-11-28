export interface ProductModel {
  id: number;
  designation: string;
  description?: string;
  category: string;
}

export interface GetProductListResponse {
  nbTotalProducts: number;
  nbPages: number;
  data: ProductModel[];
}
