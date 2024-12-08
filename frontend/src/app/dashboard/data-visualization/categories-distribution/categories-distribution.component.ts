import { Component, computed, input } from "@angular/core";
import type { EChartsOption } from "echarts";
import { NgxEchartsDirective } from "ngx-echarts";
import { CategoriesDistributionItem } from "../../dashboard.model";
import { ThemeManagerService } from "../../../shared/theme-manager/theme-manager.service";

@Component({
  selector: "app-categories-distribution",
  imports: [NgxEchartsDirective],
  templateUrl: "./categories-distribution.component.html",
  styles: ``,
})
export class CategoriesDistributionComponent {
  private seriesName = "Product per category";
  categoriesDistributionItems = input<CategoriesDistributionItem[]>([]);

  themeManagerService: ThemeManagerService;

  constructor(themeManagerService: ThemeManagerService) {
    this.themeManagerService = themeManagerService;
  }

  data = computed(() =>
    this.categoriesDistributionItems()
      .map((item) => {
        return {
          value: item.nbProducts,
          name: item.name,
          percentage: item.percentage,
        };
      })
      .sort((a, b) => (a.value > b.value ? -1 : 1)),
  );

  piePlotOptions = computed((): EChartsOption => {
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
      legend: {
        show: true,
        right: "10%", // To not overlap with the toolbox
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      series: [
        {
          name: this.seriesName,
          type: "pie",
          top: "25%",
          radius: [20, 140],
          center: ["50%", "50%"],
          roseType: "area",
          itemStyle: {
            borderRadius: 5,
          },
          data: this.data(),
        },
      ],
    };
  });

  barPlotOptions = computed((): EChartsOption => {
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
      legend: {
        show: false,
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c}%",
      },
      xAxis: {
        type: "category",
        axisLabel: {
          rotate: 45,
          overflow: "truncate",
          width: 95,
        },
        data: this.data().map((category) => category.name),
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value}%",
        },
      },
      series: [
        {
          name: this.seriesName,
          data: this.data().map((category) => category.percentage),
          type: "bar",
          colorBy: "data",
        },
      ],
    };
  });
}
