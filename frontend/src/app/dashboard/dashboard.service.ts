import { computed, Injectable, signal } from "@angular/core";
import { BasicStats, CategoriesDistributionItem } from "./dashboard.model";
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
  activatedUsersPercentage = computed(() =>
    this.basicStats() == undefined
      ? ""
      : ((this.basicStats()?.nbActiveUsers ?? 0) /
          (this.basicStats()?.nbUsers ?? 0)) *
        100,
  );
  productsIncreasePercentage = computed(() =>
    this.basicStats() == undefined
      ? ""
      : ((this.basicStats()?.nbProductsCreatedLastMonth ?? 0) /
          (this.basicStats()?.nbProducts ?? 0)) *
        100,
  );

  categoriesDistributionItems = signal<
    CategoriesDistributionItem[] | undefined
  >(undefined);

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
    CategoriesDistributionItem[] | undefined
  > {
    // TODO @JoffreyLgt: Change MOCK_DB_BASE_URL into BASE_URL when API route is created
    return this.http
      .get<
        CategoriesDistributionItem[] | undefined
      >(`${this.MOCK_DB_BASE_URL}/categories-distribution`)
      .pipe(
        tap((result: CategoriesDistributionItem[] | undefined) => {
          this.categoriesDistributionItems.set(
            result as CategoriesDistributionItem[],
          );
        }),
        map((_) => this.categoriesDistributionItems()),
      );
  }
}
