import { Component, computed, OnDestroy, signal } from "@angular/core";
import { SvgIconComponent } from "angular-svg-icon";
import { debounceTime, Subscription } from "rxjs";
import { UserService } from "../user.service";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ADMIN_ADD_USER_ROUTE,
  ADMIN_EDIT_USER_ROUTE,
  ADMIN_USERS_ROUTE,
} from "../../app.static-data";
import { PaginatorComponent } from "../../shared/paginator/paginator.component";
import { Location } from "@angular/common";

// TODO: handle the case where the page in the query doesn't exist.
//  For example: page=100 but there is only 1 page
@Component({
  selector: "app-users-management",
  imports: [SvgIconComponent, ReactiveFormsModule, PaginatorComponent],
  templateUrl: "./users-management.component.html",
  styles: ``,
})
export class UsersManagementComponent implements OnDestroy {
  private getUserListSubscription: Subscription | null = null;

  currentPage = signal<number>(1);

  search = new FormControl("");

  userService: UserService;

  // In the future, it might be a good idea to let the user decide
  private usersPerPage = 10;
  lastPage = computed(() => this.userService.userList()?.nbPages ?? 1);

  private refreshUserList() {
    this.getUserListSubscription?.unsubscribe();
    this.getUserListSubscription = this.userService
      .getUserList(
        this.currentPage(),
        this.usersPerPage,
        this.search.value ?? "",
      )
      .subscribe();
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
      ADMIN_USERS_ROUTE,
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
