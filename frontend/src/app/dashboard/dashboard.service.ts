import { Injectable, signal } from "@angular/core";
import { BasicStats, CategoriesRepartitionItem } from "./dashboard.model";
import { HttpClient } from "@angular/common/http";
import { map, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  // TODO @JoffreyLGT: fetch url from environment variable or configuration
  private BASE_URL = "https://localhost:7052/api/dashboard";
  private MOCK_DB_BASE_URL = "http://localhost:3000";

  basicStats = signal<BasicStats | undefined>(undefined);
  categoriesRepartitionItems = signal<CategoriesRepartitionItem[] | undefined>(
    undefined,
  );

  constructor(private http: HttpClient) {}

  getBasicStats(): Observable<BasicStats | undefined> {
    return this.http
      .get<BasicStats | undefined>(`${this.BASE_URL}/basic-stats`)
      .pipe(
        tap((result: any) => this.basicStats.set(result as BasicStats)),
        map((_) => this.basicStats()),
      );
  }

  getCategoriesRepartition(): Observable<
    CategoriesRepartitionItem[] | undefined
  > {
    // TODO @JoffreyLgt: Change MOCK_DB_BASE_URL into BASE_URL when API route is created
    return this.http
      .get<
        CategoriesRepartitionItem[] | undefined
      >(`${this.MOCK_DB_BASE_URL}/categories-repartition`)
      .pipe(
        tap((result: CategoriesRepartitionItem[] | undefined) => {
          this.categoriesRepartitionItems.set(
            result as CategoriesRepartitionItem[],
          );
        }),
        map((_) => this.categoriesRepartitionItems()),
      );
  }
}
