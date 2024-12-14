import { Component, computed, OnDestroy, signal } from "@angular/core";
import { SvgIconComponent } from "angular-svg-icon";
import { debounceTime, Subscription } from "rxjs";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ADMIN_ADD_PRODUCT_ROUTE,
  ADMIN_EDIT_PRODUCT_ROUTE,
  ADMIN_PRODUCT_LIST_ROUTE,
} from "../../app.static-data";
import { PaginatorComponent } from "../../shared/paginator/paginator.component";
import { Location } from "@angular/common";
import { ProductService } from "../product.service";
import { GetProductListResponse } from "../product.model";

@Component({
  selector: "app-product-management",
  imports: [SvgIconComponent, ReactiveFormsModule, PaginatorComponent],
  templateUrl: "./product-management.component.html",
  styles: ``,
})
export class ProductManagementComponent implements OnDestroy {
  private getProductListSubscription: Subscription | null = null;

  isLoading = signal(false);
  currentPage = signal<number>(1);
  productsDisplayed = computed(() => {
    return {
      start: (this.currentPage() - 1) * this.productsPerPage + 1,
      end: Math.min(
        this.currentPage() * this.productsPerPage,
        this.productService.productList()?.nbTotalProducts ?? 0,
      ),
      total: this.productService.productList()?.nbTotalProducts ?? 0,
    };
  });

  search = new FormControl("");

  productService: ProductService;

  // In the future, it might be a good idea to let the user decide
  private productsPerPage = 10;
  lastPage = computed(() => this.productService.productList()?.nbPages ?? 1);

  private refreshList() {
    this.isLoading.set(true);
    this.getProductListSubscription?.unsubscribe();
    this.getProductListSubscription = this.productService
      .getProductList(
        this.currentPage(),
        this.productsPerPage,
        this.search.value ?? "",
      )
      .subscribe({
        next: (response: GetProductListResponse | undefined) => {
          // Reset the current page number to 1 if the requested page
          // is above the number of pages
          if (
            this.currentPage !== undefined &&
            response !== undefined &&
            this.currentPage() > response.nbPages
          ) {
            this.currentPage.set(1);
            this.updateUrlQuery();
          }
          this.isLoading.set(false);
        },
        error: (_) => {
          this.isLoading.set(false);
        },
      });
  }

  constructor(
    productService: ProductService,
    route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {
    this.productService = productService;

    // Set values from url query params
    this.currentPage.set(parseInt(route.snapshot.queryParams["page"] ?? "1"));
    this.search.setValue(route.snapshot.queryParams["search"] ?? "");

    this.refreshList();

    // Set valueChange on the search input and trigger the event after 1s \
    // of inactivity
    this.search.valueChanges.pipe(debounceTime(1000)).subscribe((_) => {
      this.refreshList();
      this.updateUrlQuery();
    });
  }

  changePage(pageNumber: number) {
    this.currentPage.set(pageNumber);
    this.updateUrlQuery();
    this.refreshList();
  }

  updateUrlQuery() {
    this.location.replaceState(
      ADMIN_PRODUCT_LIST_ROUTE,
      `page=${this.currentPage()}&search=${this.search.value}`,
    );
  }

  addProduct() {
    this.router.navigate([ADMIN_ADD_PRODUCT_ROUTE]).then();
  }

  editProduct(id: number) {
    this.router.navigate([ADMIN_EDIT_PRODUCT_ROUTE, id]).then();
  }

  ngOnDestroy() {
    this.getProductListSubscription?.unsubscribe();
  }
}
