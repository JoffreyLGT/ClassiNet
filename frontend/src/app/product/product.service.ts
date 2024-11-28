import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  Category,
  GetProductListResponse,
  ProductModel,
} from "./product.model";
import { map, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  // TODO: remove mock url and replace all calls with the correct route form api
  private MOCK_DB_BASE_URL = "http://localhost:3000";

  categoryList = signal<Category[] | undefined>(undefined);
  productList = signal<GetProductListResponse | undefined>(undefined);
  editedProduct = signal<ProductModel | undefined>(undefined);

  constructor(private http: HttpClient) {}

  getCategoryList() {
    return this.http.get(`${this.MOCK_DB_BASE_URL}/categories`).pipe(
      tap((result: any) => this.categoryList.set(result as Category[])),
      map((_) => this.categoryList()),
    );
  }

  getProductList(
    page: number = 1,
    usersPerPage: number = 10,
    search: string = "",
  ) {
    const skip = page * usersPerPage;
    return this.http
      .get(
        `${this.MOCK_DB_BASE_URL}/get-product-list?skip=${skip}&take=${usersPerPage}&search=${search}`,
      )
      .pipe(
        tap((result: any) =>
          this.productList.set(result as GetProductListResponse),
        ),
        map((_) => this.productList()),
      );
  }

  postProduct(product: ProductModel): Observable<ProductModel | undefined> {
    return this.http.post(`${this.MOCK_DB_BASE_URL}/products`, product).pipe(
      tap((result: any) => this.editedProduct.set(result as ProductModel)),
      map((_) => this.editedProduct()),
    );
  }

  getProduct(id: string): Observable<ProductModel | undefined> {
    return this.http.get(`${this.MOCK_DB_BASE_URL}/products/${id}`).pipe(
      tap((result: any) => this.editedProduct.set(result as ProductModel)),
      map((_) => this.editedProduct()),
    );
  }
}
