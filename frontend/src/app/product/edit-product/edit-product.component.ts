import { Component, OnDestroy, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SvgIconComponent } from "angular-svg-icon";
import { ActivatedRoute, Router } from "@angular/router";
import { ADMIN_PRODUCT_LIST_ROUTE } from "../../app.static-data";
import { Subscription } from "rxjs";
import { ProductService } from "../product.service";
import {
  PatchProductPayload,
  PostProductPayload,
  Product,
  ProductForm,
} from "../product.model";
import { ProductFormComponent } from "../product-form/product-form.component";

@Component({
  selector: "app-edit-product",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SvgIconComponent,
    ProductFormComponent,
  ],
  templateUrl: "./edit-product.component.html",
  styles: ``,
})
export class EditProductComponent implements OnDestroy {
  formMode: "add" | "edit" = "add";

  productFormValues = signal<ProductForm>({});

  categoriesSubscription: Subscription;
  editedProductSubscription: Subscription | null = null;
  errorMessage: string | null = null;
  success: boolean = false;

  productId: string | null = null;

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
            this.productFormValues.set({
              id: result.id,
              designation: result.designation,
              description: result.description,
              categoryId: result.category.id,
            });
          },
          error: (_) => {
            this.router.navigate(["/404"], { skipLocationChange: true }).then();
          },
        });
    }
  }

  onSubmit() {
    if (this.formMode === "add") {
      const product: PostProductPayload = {
        designation: this.productFormValues().designation ?? "",
        description: this.productFormValues().description ?? "",
        categoryId: this.productFormValues().categoryId ?? 0,
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
        designation: this.productFormValues().designation,
        description: this.productFormValues().description,
        categoryId: this.productFormValues().categoryId ?? -1,
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
