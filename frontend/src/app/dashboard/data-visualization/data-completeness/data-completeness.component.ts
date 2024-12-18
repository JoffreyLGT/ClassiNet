import { Component, computed, input } from "@angular/core";
import { NgxEchartsDirective } from "ngx-echarts";
import { DataCompletenessStats } from "../../dashboard.model";
import type { EChartsOption } from "echarts";
import { ThemeManagerService } from "../../../shared/theme-manager/theme-manager.service";

@Component({
  selector: "app-data-completeness",
  imports: [NgxEchartsDirective],
  templateUrl: "./data-completeness.component.html",
})
export class DataCompletenessComponent {
  themeManagerService: ThemeManagerService;
  dataCompletenessStats = input<DataCompletenessStats | undefined>(undefined);

  completeOptions = computed((): EChartsOption => {
    return {
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{a}<br/>{b}: {c} ({d}%)",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      series: [
        {
          name: "Data completeness",
          type: "pie",
          radius: ["80%", "120%"],
          center: ["50%", "100%"],
          // adjust the start and end angle
          startAngle: 180,
          endAngle: 360,
          label: {
            formatter: "{b} ({d}%)",
          },
          data: [
            { name: "Complete", value: this.dataCompletenessStats()?.complete },
            {
              name: "Missing description only",
              value: this.dataCompletenessStats()?.missingDescriptionOnly,
            },
            {
              name: "Missing image only",
              value: this.dataCompletenessStats()?.missingImageOnly,
            },
            {
              name: "Missing description and image",
              value: this.dataCompletenessStats()?.missingDescriptionAndImage,
            },
          ],
        },
      ],
    };
  });

  constructor(themeManagerService: ThemeManagerService) {
    this.themeManagerService = themeManagerService;
  }
}
