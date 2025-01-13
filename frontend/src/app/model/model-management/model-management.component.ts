import { Component, computed, OnDestroy, signal } from "@angular/core";
import { SvgIconComponent } from "angular-svg-icon";
import { debounceTime, Subscription } from "rxjs";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ADMIN_EDIT_MODEL_ROUTE,
  ADMIN_MODEL_LIST_ROUTE,
} from "../../app.static-data";
import { PaginatorComponent } from "../../shared/paginator/paginator.component";
import { DatePipe, Location } from "@angular/common";
import { ModelService } from "../model.service";
import { GetModelListResponse } from "../model.model";

@Component({
  selector: "app-model-management",
  imports: [
    SvgIconComponent,
    ReactiveFormsModule,
    PaginatorComponent,
    DatePipe,
  ],
  templateUrl: "./model-management.component.html",
  styles: ``,
})
export class ModelManagementComponent implements OnDestroy {
  private modelListSubscription: Subscription | null = null;

  isLoading = signal(false);
  isModalOpened = signal(false);
  modelIdToDelete = signal<string>("");

  currentPage = signal<number>(1);
  modelsDisplayed = computed(() => {
    return {
      start: (this.currentPage() - 1) * this.modelsPerPage + 1,
      end: Math.min(
        this.currentPage() * this.modelsPerPage,
        this.modelService.modelList()?.nbTotal ?? 0,
      ),
      total: this.modelService.modelList()?.nbTotal ?? 0,
    };
  });

  search = new FormControl("");

  modelService: ModelService;

  // In the future, it might be a good idea to let the user decide
  private modelsPerPage = 10;
  lastPage = computed(() => this.modelService.modelList()?.nbPages ?? 1);

  private refreshList() {
    this.isLoading.set(true);
    this.modelListSubscription?.unsubscribe();
    this.modelListSubscription = this.modelService
      .getModelList(
        this.currentPage(),
        this.modelsPerPage,
        this.search.value ?? "",
      )
      .subscribe({
        next: (response: GetModelListResponse | undefined) => {
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
    modelService: ModelService,
    route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {
    this.modelService = modelService;

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
      ADMIN_MODEL_LIST_ROUTE,
      `page=${this.currentPage()}&search=${this.search.value}`,
    );
  }

  setAsActiveModel(id: string) {
    this.isLoading.set(true);
    this.modelService.setAsActiveModel(id).subscribe({
      next: (_) => {
        this.refreshList();
      },
      error: (_) => {
        this.isLoading.set(false);
      },
    });
  }

  editModel(id: string) {
    this.router.navigate([ADMIN_EDIT_MODEL_ROUTE, id]).then();
  }

  openDeleteModal(id: string) {
    this.isModalOpened.set(true);
    this.modelIdToDelete.set(id);
  }

  deleteModel() {
    this.isLoading.set(true);
    this.modelService.deleteModel(this.modelIdToDelete()).subscribe({
      next: (_) => {
        this.refreshList();
      },
      error: (_) => {
        this.isLoading.set(false);
      }
    });
  }

  ngOnDestroy() {
    this.modelListSubscription?.unsubscribe();
  }
}
