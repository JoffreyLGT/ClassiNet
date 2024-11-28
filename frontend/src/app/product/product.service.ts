import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GetProductListResponse } from "./product.model";
import { map, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  // TODO: remove mock url and replace all calls with the correct route form api
  private MOCK_DB_BASE_URL = "http://localhost:3000";

  productList = signal<GetProductListResponse | undefined>(undefined);

  constructor(private http: HttpClient) {}

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
}
