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

  constructor(dashboardService: DashboardService) {
    this.dashboardService = dashboardService;
    this.getBasicStatsSubscription = dashboardService
      .getBasicStats()
      .subscribe();
  }

  ngOnDestroy() {
    this.getBasicStatsSubscription?.unsubscribe();
  }
}
