import { Component, computed, OnDestroy, signal } from "@angular/core";
import { SvgIconComponent } from "angular-svg-icon";
import { debounceTime, Subscription } from "rxjs";
import { UserService } from "../user.service";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import {
  ADMIN_ADD_USER_ROUTE,
  ADMIN_EDIT_USER_ROUTE,
} from "../../app.static-data";
import { PaginatorComponent } from "../../shared/paginator/paginator.component";

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
    private router: Router,
  ) {
    this.userService = userService;
    this.refreshUserList();
    this.search.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((_) => this.refreshUserList());
  }

  changePage(pageNumber: number) {
    this.currentPage.set(pageNumber);
    this.refreshUserList();
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
