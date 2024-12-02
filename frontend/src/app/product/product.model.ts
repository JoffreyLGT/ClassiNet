/**
 * Defines the content of a category returned by the API.
 */
export interface Category {
  id: number;
  name: string;
}

/**
 * Defines the content of a product returned by the API.
 */
export interface Product {
  id: number;
  designation: string;
  description?: string;
  category: Category;
}

/**
 *  Defines the content of the payload expected to send a patch request
 *  to update a product on the API.
 */
export interface PatchProductPayload {
  id: number;
  designation?: string;
  description?: string;
  categoryId: number;
}

/**
 * Defines the content of the payload expected to send a patch request
 * to create a new product on the API.
 */
export interface PostProductPayload {
  designation: string;
  description?: string;
  categoryId: number;
}

/**
 * Defines the response from the product service when sending a request
 * to get a list of products.
 */
export interface GetProductListResponse {
  nbTotalProducts: number;
  nbPages: number;
  data: Product[];
}
