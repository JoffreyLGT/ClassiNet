import { Component, OnDestroy } from "@angular/core";
import { CategoriesDistributionComponent } from "./categories-distribution/categories-distribution.component";
import { DashboardService } from "../dashboard.service";
import { Subscription } from "rxjs";
import { SvgIconComponent } from "angular-svg-icon";
import { DataCompletenessComponent } from "./data-completeness/data-completeness.component";

@Component({
  selector: "app-data-visualization",
  imports: [
    CategoriesDistributionComponent,
    SvgIconComponent,
    DataCompletenessComponent,
  ],
  templateUrl: "./data-visualization.component.html",
})
export class DataVisualizationComponent implements OnDestroy {
  dashboardService: DashboardService;

  private getCategoriesRepartition: Subscription | null = null;
  private getBasicStatsSubscription: Subscription | null = null;
  private getDataCompletenessSubscription: Subscription | null = null;

  constructor(dashboardService: DashboardService) {
    this.dashboardService = dashboardService;
    this.getCategoriesRepartition = dashboardService
      .getCategoriesRepartition()
      .subscribe();
    this.getBasicStatsSubscription = dashboardService
      .getBasicStats()
      .subscribe();
    this.getDataCompletenessSubscription = dashboardService
      .getDataCompletenessStats()
      .subscribe();
  }

  ngOnDestroy() {
    this.getCategoriesRepartition?.unsubscribe();
    this.getBasicStatsSubscription?.unsubscribe();
    this.getDataCompletenessSubscription?.unsubscribe();
  }
}
