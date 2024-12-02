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
import {
  PatchProductPayload,
  PostProductPayload,
  Product,
} from "../product.model";

@Component({
  selector: "app-edit-product",
  imports: [FormsModule, ReactiveFormsModule, SvgIconComponent],
  templateUrl: "./edit-product.component.html",
  styles: ``,
})
export class EditProductComponent implements OnDestroy {
  formMode: "add" | "edit" = "add";

  categoriesSubscription: Subscription;
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
      this.formMode = "edit";
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
              ?.setValue(result.category?.id.toString() ?? null);
          },
          error: (_) => {
            this.router.navigate(["/404"], { skipLocationChange: true }).then();
          },
        });
    }
  }

  onSubmit() {
    if (
      this.productForm.controls["category"].value === null ||
      this.productForm.controls["designation"].value === null ||
      this.productForm.controls["description"].value === null
    ) {
      console.error("Invalid form");
      return;
    }

    if (this.formMode === "add") {
      const product: PostProductPayload = {
        designation: this.productForm.controls["designation"].value,
        description: this.productForm.controls["description"].value,
        categoryId: Number.parseInt(
          this.productForm.controls["category"].value,
        ),
      };

      this.editedProductSubscription = this.productService
        .postProduct(product)
        .subscribe({
          next: (_: Product | null | undefined) => {
            this.errorMessage = null;
            this.success = true;
            this.redirectToProductList();
          },
          error: (error) => {
            this.errorMessage = error.error;
            this.success = false;
          },
        });
    } else {
      if (this.productId === null) {
        console.error("Can't update product without productId");
        return;
      }

      const product: PatchProductPayload = {
        id: Number.parseInt(this.productId),
        designation: this.productForm.controls["designation"].value,
        description: this.productForm.controls["description"].value,
        categoryId: Number.parseInt(
          this.productForm.controls["category"].value,
        ),
      };
      this.editedProductSubscription = this.productService
        .updateProduct(product)
        .subscribe({
          next: (_) => {
            this.errorMessage = null;
            this.success = true;
            this.redirectToProductList();
          },
          error: (error) => {
            this.errorMessage = error.error;
            this.success = false;
          },
        });
    }
  }

  redirectToProductList() {
    setTimeout(() => {
      this.router.navigate([ADMIN_PRODUCT_LIST_ROUTE]).then();
    }, 1500);
  }

  ngOnDestroy() {
    this.categoriesSubscription?.unsubscribe();
    this.editedProductSubscription?.unsubscribe();
  }
}
