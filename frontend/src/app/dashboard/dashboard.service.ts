import { computed, Injectable, signal } from "@angular/core";
import {
  BasicStats,
  CategoriesDistributionItem,
  DataCompletenessStats,
  TextVariableStats,
  WordCount,
} from "./dashboard.model";
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
  dataCompletenessStats = signal<DataCompletenessStats | undefined>(undefined);
  designationVariableStats = signal<TextVariableStats | undefined>(undefined);
  descriptionVariableStats = signal<TextVariableStats | undefined>(undefined);

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
    // TODO: Change MOCK_DB_BASE_URL into BASE_URL when API route is created
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

  getDataCompletenessStats(): Observable<DataCompletenessStats | undefined> {
    // TODO: Change MOCK_DB_BASE_URL into BASE_URL when API route is created
    return this.http
      .get<
        DataCompletenessStats | undefined
      >(`${this.MOCK_DB_BASE_URL}/data-completeness`)
      .pipe(
        tap((result: DataCompletenessStats | undefined) => {
          this.dataCompletenessStats.set(result as DataCompletenessStats);
        }),
        map((_) => this.dataCompletenessStats()),
      );
  }

  getDesignationVariableStats(): Observable<TextVariableStats | undefined> {
    // TODO: Change MOCK_DB_BASE_URL into BASE_URL when API route is created
    // TODO: Change the suffix of the url when API route is created
    return this.http
      .get<
        TextVariableStats | undefined
      >(`${this.MOCK_DB_BASE_URL}/text-variable-stats-designation`)
      .pipe(
        tap((result: TextVariableStats | undefined) => {
          this.designationVariableStats.set(result as TextVariableStats);
        }),
        map((_) => this.designationVariableStats()),
      );
  }

  getDescriptionVariableStats(): Observable<TextVariableStats | undefined> {
    // TODO: Change MOCK_DB_BASE_URL into BASE_URL when API route is created
    // TODO: Change the suffix of the url when API route is created
    return this.http
      .get<
        TextVariableStats | undefined
      >(`${this.MOCK_DB_BASE_URL}/text-variable-stats-description`)
      .pipe(
        tap((result: TextVariableStats | undefined) => {
          this.descriptionVariableStats.set(result as TextVariableStats);
        }),
        map((_) => this.descriptionVariableStats()),
      );
  }
}
