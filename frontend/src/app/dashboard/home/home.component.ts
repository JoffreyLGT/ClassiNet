import { Component, OnDestroy, signal } from "@angular/core";
import { DashboardService } from "../dashboard.service";
import { Subscription } from "rxjs";
import { SvgIconComponent } from "angular-svg-icon";

@Component({
  selector: "app-home",
  imports: [SvgIconComponent],
  templateUrl: "./home.component.html",
  styles: ``,
})
export class HomeComponent implements OnDestroy {
  private getBasicStatsSubscription: Subscription | null = null;

  dashboardService: DashboardService;
  activatedUsersPercentage = signal<number>(0);
  productsIncreasePercentage = signal<number>(0);

  constructor(dashboardService: DashboardService) {
    this.dashboardService = dashboardService;
    this.getBasicStatsSubscription = dashboardService
      .getBasicStats()
      .subscribe({
        next: (stats) => {
          if (stats !== undefined) {
            this.activatedUsersPercentage.set(
              (stats.nbActiveUsers / stats.nbUsers) * 100,
            );
            this.productsIncreasePercentage.set(
              (stats.nbProductsCreatedLastMonth / stats.nbProducts) * 100,
            );
          }
        },
      });
  }

  ngOnDestroy() {
    this.getBasicStatsSubscription?.unsubscribe();
  }
}
