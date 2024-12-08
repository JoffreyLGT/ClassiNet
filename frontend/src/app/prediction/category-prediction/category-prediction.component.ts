import { Component, OnDestroy, signal } from "@angular/core";
import { ProductFormComponent } from "../../product/product-form/product-form.component";
import { ProductForm } from "../../product/product.model";
import { SvgIconComponent } from "angular-svg-icon";
import { PredictionService } from "../prediction.service";
import { Subscription } from "rxjs";
import {
  PostPredictionRequestPayload,
  PostPredictionResponse,
} from "../prediction.model";
import { ProductService } from "../../product/product.service";

@Component({
  selector: "app-category-prediction",
  imports: [ProductFormComponent, SvgIconComponent],
  templateUrl: "./category-prediction.component.html",
})
export class CategoryPredictionComponent implements OnDestroy {
  product = signal<ProductForm>({});
  status = signal<"loading" | "error" | "success" | "default">("default");

  predictionResponse = signal<{ category: string; probability: number }[]>([]);

  productService: ProductService;
  predictionService: PredictionService;
  postCategoryPredictionSubscription: Subscription | null = null;
  getCategoryListSubscription: Subscription | null = null;

  constructor(
    predictionService: PredictionService,
    productService: ProductService,
  ) {
    this.predictionService = predictionService;
    this.productService = productService;

    this.getCategoryListSubscription = this.productService
      .getCategoryList()
      .subscribe();
  }

  onSubmit() {
    this.status.set("loading");
    this.predictionService
      .postCategoryPrediction(this.product() as PostPredictionRequestPayload)
      .subscribe({
        next: (response: PostPredictionResponse | undefined) => {
          if (response === undefined) return;
          this.predictionResponse.set(
            response.probabilities
              .sort((a, b) => b.probability - a.probability)
              .slice(0, 3)
              .map((p) => ({
                category:
                  this.productService
                    .categoryList()
                    ?.find((cat) => cat.id === p.categoryId)?.name ?? "",
                probability: p.probability,
              })),
          );
          this.status.set("success");
        },
        error: (_) => {
          this.status.set("error");
        },
      });
  }

  ngOnDestroy() {
    this.postCategoryPredictionSubscription?.unsubscribe();
    this.getCategoryListSubscription?.unsubscribe();
  }
}
