import { Component, OnDestroy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SvgIconComponent } from "angular-svg-icon";
import { ActivatedRoute, Router } from "@angular/router";
import { ADMIN_PRODUCT_LIST_ROUTE } from "../../app.static-data";
import { Subscription } from "rxjs";
import { ProductService } from "../product.service";
import { ProductModel } from "../product.model";

// TODO: handle the usecase where the product id is not found in db
@Component({
  selector: "app-edit-product",
  imports: [FormsModule, ReactiveFormsModule, SvgIconComponent],
  templateUrl: "./edit-product.component.html",
  styles: ``,
})
export class EditProductComponent implements OnDestroy {
  categoriesSubscription: Subscription | null = null;
  editedProductSubscription: Subscription | null = null;
  errorMessage: string | null = null;
  success: boolean = false;

  productId: string | null = null;

  productForm = new FormGroup({
    designation: new FormControl("", [
      Validators.required,
      Validators.maxLength(256),
    ]),
    description: new FormControl(""),
    category: new FormControl("", Validators.required),
  });

  productService: ProductService;

  constructor(
    productService: ProductService,
    route: ActivatedRoute,
    private router: Router,
  ) {
    this.productService = productService;

    this.categoriesSubscription = productService.getCategoryList().subscribe();

    this.productId = route.snapshot.paramMap.get("id");
    if (this.productId !== null) {
      this.editedProductSubscription = productService
        .getProduct(this.productId)
        .subscribe({
          next: (result) => {
            if (result === undefined) {
              return;
            }
            this.productForm.get("designation")?.setValue(result.designation);
            this.productForm
              .get("description")
              ?.setValue(result.description ?? "");
            this.productForm
              .get("category")
              ?.setValue(result.category?.id ?? null);
          },
        });
    }
  }

  onSubmit() {
    const product: ProductModel = {
      id: 0,
      designation: this.productForm.controls["designation"].value ?? "",
      description: this.productForm.controls["description"].value ?? "",
      category: this.productService
        .categoryList()
        ?.find(
          (category) =>
            category.id === this.productForm.controls["category"].value,
        ),
    };
    this.editedProductSubscription = this.productService
      .postProduct(product)
      .subscribe({
        next: (_: ProductModel | null | undefined) => {
          this.errorMessage = null;
          this.success = true;
          setTimeout(() => {
            this.router.navigate([ADMIN_PRODUCT_LIST_ROUTE]).then();
          }, 1500);
        },
        error: (error) => {
          this.errorMessage = error.error;
          this.success = false;
        },
      });
  }

  ngOnDestroy() {
    this.categoriesSubscription?.unsubscribe();
    this.editedProductSubscription?.unsubscribe();
  }
}
