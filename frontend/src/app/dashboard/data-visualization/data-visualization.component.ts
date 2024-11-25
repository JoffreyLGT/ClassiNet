import { Component } from "@angular/core";
import { CategoriesDistributionComponent } from "./categories-distribution/categories-distribution.component";
import { DashboardService } from "../dashboard.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-data-visualization",
  imports: [CategoriesDistributionComponent],
  templateUrl: "./data-visualization.component.html",
  styleUrl: "./data-visualization.component.css",
})
export class DataVisualizationComponent {
  dashboardService: DashboardService;

  private getCategoriesRepartition: Subscription | null = null;

  constructor(dashboardService: DashboardService) {
    this.dashboardService = dashboardService;
    this.getCategoriesRepartition = dashboardService
      .getCategoriesRepartition()
      .subscribe();
  }
}
