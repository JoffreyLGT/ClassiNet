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
 * Represents the input values for product-related data.
 *
 * This interface is used to define the structure of product data that is submitted
 * to or received from a form. It includes basic product information such as the
 * product's ID, designation, description, and associated category ID. All fields
 * are optional, allowing partial updates or submissions as needed.
 *
 * Properties:
 * @property {number} [id] - The unique identifier for the product.
 * @property {string} [designation] - The title or name of the product.
 * @property {string} [description] - Detailed information about the product.
 * @property {number} [categoryId] - The identifier for the category to which the product belongs.
 */
export interface ProductForm {
  id?: number;
  designation?: string;
  description?: string;
  categoryId?: number;
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
