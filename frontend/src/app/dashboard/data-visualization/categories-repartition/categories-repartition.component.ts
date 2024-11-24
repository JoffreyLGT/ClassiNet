import { Component, computed, input } from "@angular/core";
import type { EChartsOption } from "echarts";
import { NgxEchartsDirective } from "ngx-echarts";
import { CategoriesRepartitionItem } from "../../dashboard.model";

@Component({
  selector: "app-categories-repartition",
  imports: [NgxEchartsDirective],
  templateUrl: "./categories-repartition.component.html",
  styleUrl: "./categories-repartition.component.css",
})
export class CategoriesRepartitionComponent {
  categoriesRepartitionItems = input<CategoriesRepartitionItem[]>([]);

  options = computed((): EChartsOption => {
    return {
      title: {},
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
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      series: [
        {
          name: "Products repartition",
          type: "pie",
          radius: [20, 140],
          center: ["50%", "50%"],
          roseType: "area",
          itemStyle: {
            borderRadius: 5,
          },
          data: this.categoriesRepartitionItems()
            .map((item) => {
              return {
                value: item.nbProducts,
                name: item.name,
              };
            })
            .sort((a, b) => (a.value > b.value ? -1 : 1)),
        },
      ],
    };
  });
}
