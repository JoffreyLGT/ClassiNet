import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  Category,
  GetProductListResponse,
  PatchProductPayload,
  PostProductPayload,
  Product,
} from "./product.model";
import { map, Observable, tap } from "rxjs";
import { HEADER_PAGINATOR_KEY } from "../app.static-data";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  categoryList = signal<Category[] | undefined>(undefined);
  productList = signal<GetProductListResponse | undefined>(undefined);
  editedProduct = signal<Product | undefined>(undefined);

  constructor(private http: HttpClient) {}

  getCategoryList() {
    return this.http.get(`${environment.api_url}/categories`).pipe(
      tap((result: any) => {
        this.categoryList.set(result as Category[]);
      }),
      map((_) => this.categoryList()),
    );
  }

  getProductList(
    page: number = 1,
    usersPerPage: number = 10,
    search: string = "",
  ) {
    const skip = (page - 1) * usersPerPage;
    return this.http
      .get(
        `${environment.api_url}/products?skip=${skip}&take=${usersPerPage}&search=${search}`,
        { observe: "response" },
      )
      .pipe(
        tap((result: any) => {
          const pagination = JSON.parse(
            result.headers.get(HEADER_PAGINATOR_KEY),
          );
          return this.productList.set({
            nbPages: pagination.TotalPages,
            nbTotalProducts: pagination.TotalRecords,
            data: result.body,
          });
        }),
        map((_) => this.productList()),
      );
  }

  postProduct(product: PostProductPayload): Observable<Product | undefined> {
    return this.http.post(`${environment.api_url}/products`, product).pipe(
      tap((result: any) => this.editedProduct.set(result as Product)),
      map((_) => this.editedProduct()),
    );
  }

  updateProduct(product: PatchProductPayload): Observable<Product | undefined> {
    return this.http.patch(`${environment.api_url}/products`, product).pipe(
      tap((result: any) => this.editedProduct.set(result as Product)),
      map((_) => this.editedProduct()),
    );
  }

  getProduct(id: string): Observable<Product | undefined> {
    return this.http.get(`${environment.api_url}/products/${id}`).pipe(
      tap((result: any) => this.editedProduct.set(result as Product)),
      map((_) => this.editedProduct()),
    );
  }
}
