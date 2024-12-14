import { Component, computed, OnDestroy, signal } from "@angular/core";
import { SvgIconComponent } from "angular-svg-icon";
import { debounceTime, Subscription } from "rxjs";
import { UserService } from "../user.service";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ADMIN_ADD_USER_ROUTE,
  ADMIN_EDIT_USER_ROUTE,
  ADMIN_USER_LIST_ROUTE,
} from "../../app.static-data";
import { PaginatorComponent } from "../../shared/paginator/paginator.component";
import { Location } from "@angular/common";
import { GetUserListResponse } from "../user.model";

@Component({
  selector: "app-user-management",
  imports: [SvgIconComponent, ReactiveFormsModule, PaginatorComponent],
  templateUrl: "./user-management.component.html",
  styles: ``,
})
export class UserManagementComponent implements OnDestroy {
  private getUserListSubscription: Subscription | null = null;

  isLoading = signal(false);
  currentPage = signal<number>(1);
  usersDisplayed = computed(() => {
    return {
      start: (this.currentPage() - 1) * this.usersPerPage + 1,
      end: Math.min(
        this.currentPage() * this.usersPerPage,
        this.userService.userList()?.nbTotalUsers ?? 0,
      ),
      total: this.userService.userList()?.nbTotalUsers ?? 0,
    };
  });

  search = new FormControl("");

  userService: UserService;

  // In the future, it might be a good idea to let the user decide
  private usersPerPage = 10;
  lastPage = computed(() => this.userService.userList()?.nbPages ?? 1);

  private refreshUserList() {
    this.isLoading.set(true);
    this.getUserListSubscription?.unsubscribe();
    this.getUserListSubscription = this.userService
      .getUserList(
        this.currentPage(),
        this.usersPerPage,
        this.search.value ?? "",
      )
      .subscribe({
        next: (response: GetUserListResponse | undefined) => {
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
    userService: UserService,
    route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {
    this.userService = userService;

    // Set values from url query params
    this.currentPage.set(parseInt(route.snapshot.queryParams["page"] ?? "1"));
    this.search.setValue(route.snapshot.queryParams["search"] ?? "");

    this.refreshUserList();

    // Set valueChange on the search input and trigger the event after 1s \
    // of inactivity
    this.search.valueChanges.pipe(debounceTime(1000)).subscribe((_) => {
      this.refreshUserList();
      this.updateUrlQuery();
    });
  }

  changePage(pageNumber: number) {
    this.currentPage.set(pageNumber);
    this.updateUrlQuery();
    this.refreshUserList();
  }

  updateUrlQuery() {
    this.location.replaceState(
      ADMIN_USER_LIST_ROUTE,
      `page=${this.currentPage()}&search=${this.search.value}`,
    );
  }

  addUser() {
    this.router.navigate([ADMIN_ADD_USER_ROUTE]).then();
  }

  editUser(userId: string) {
    this.router.navigate([ADMIN_EDIT_USER_ROUTE, userId]).then();
  }

  ngOnDestroy() {
    this.getUserListSubscription?.unsubscribe();
  }
}
