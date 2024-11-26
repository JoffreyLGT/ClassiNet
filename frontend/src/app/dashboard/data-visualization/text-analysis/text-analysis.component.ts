import { Component, computed, input } from "@angular/core";
import { NgxEchartsDirective } from "ngx-echarts";
import { TextVariableStats } from "../../dashboard.model";
import type { EChartsOption } from "echarts";
import "echarts-wordcloud";
import { SvgIconComponent } from "angular-svg-icon";

@Component({
  selector: "app-text-analysis",
  imports: [NgxEchartsDirective, SvgIconComponent],
  templateUrl: "./text-analysis.component.html",
})
export class TextAnalysisComponent {
  textVariableStats = input<TextVariableStats | undefined>(undefined);

  wordsCountDecrease = computed(() => {
    if (this.textVariableStats() !== undefined) {
      const wordsBeforeProcessing =
        this.textVariableStats()?.nbWordsBeforeProcessing ?? 0;
      const wordsAfterProcessing = this.textVariableStats()?.nbWords ?? 0;
      return ((wordsAfterProcessing / wordsBeforeProcessing) * 100).toFixed(2);
    }
    return 0;
  });

  // @ts-ignore
  wordCloudOptions = computed(() => {
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
      },
      series: [
        {
          type: "wordCloud",

          // The shape of the "cloud" to draw. Can be any polar equation represented as a
          // callback function, or a keyword present. Available presents are circle (default),
          // cardioid (apple or heart shape curve, the most known polar equation), diamond (
          // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.

          shape: "circle",

          // Keep aspect ratio of maskImage or 1:1 for shapes
          // This option is supported since echarts-wordcloud@2.1.0
          keepAspect: false,

          // A silhouette image which the white area will be excluded from drawing texts.
          // The shape option will continue to apply as the shape of the cloud to grow.

          // maskImage: maskImage,

          // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
          // Default to be put in the center and has 75% x 80% size.

          left: "center",
          top: "center",
          width: "70%",
          height: "80%",
          right: null,
          bottom: null,

          // Text size range which the value in data will be mapped to.
          // Default to have minimum 12px and maximum 60px size.

          sizeRange: [12, 60],

          // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45

          rotationRange: [-90, 90],
          rotationStep: 45,

          // size of the grid in pixels for marking the availability of the canvas
          // the larger the grid size, the bigger the gap between words.

          gridSize: 8,

          // set to true to allow word to be drawn partly outside of the canvas.
          // Allow word bigger than the size of the canvas to be drawn
          // This option is supported since echarts-wordcloud@2.1.0
          drawOutOfBound: false,

          // if the font size is too large for the text to be displayed,
          // whether to shrink the text. If it is set to false, the text will
          // not be rendered. If it is set to true, the text will be shrinked.
          // This option is supported since echarts-wordcloud@2.1.0
          shrinkToFit: false,

          // If perform layout animation.
          // NOTE disable it will lead to UI blocking when there is lots of words.
          layoutAnimation: true,

          // Global text style
          textStyle: {
            fontFamily: "sans-serif",
            fontWeight: "bold",
            // Color can be a callback function or a color string
            color: function () {
              // Random color
              return (
                "rgb(" +
                [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                ].join(",") +
                ")"
              );
            },
          },
          emphasis: {
            focus: "self",

            textStyle: {
              textShadowBlur: 10,
              textShadowColor: "#333",
            },
          },

          // Data is an array. Each array item must have name and value property.
          data: this.textVariableStats()?.wordsCount.map((item) => {
            return { name: item.word, value: item.count };
          }),
        },
      ],
    } as any;
  });

  constructor() {}
}
