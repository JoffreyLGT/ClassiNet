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

@Component({
  selector: "app-users-management",
  imports: [SvgIconComponent, ReactiveFormsModule],
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

  pageList = computed((): (number | null)[] => {
    // TODO: The content of this function could be set in a utilities file
    // TODO: This function is hardcored and should be simplified with recursion
    const nbPages = this.userService.userList()?.nbPages ?? 1;
    const currentPage = this.currentPage();

    const nbButtons = 7;

    // Case where there is less pages than buttons
    if (nbPages <= nbButtons) {
      return [...Array(nbPages).keys()].map((i) => i + 1);
    }
    // Case where the current page is near the beginning
    if (currentPage <= nbButtons - 3) {
      const result: (number | null)[] = [...Array(nbButtons - 2).keys()].map(
        (i) => i + 1,
      );
      result.push(null, nbPages);
      return result;
    }
    // Case where the current page is near the end
    if (currentPage > nbPages - (nbButtons - 2)) {
      const result = [];
      for (let i = nbPages; i > nbPages - (nbButtons - 2); i--) {
        result.unshift(i);
      }
      result.unshift(1, null);
      return result;
    }
    // Case where the page is in between
    return [
      1,
      null,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      null,
      nbPages,
    ];
  });

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

  previousPage() {
    this.currentPage.update((value) => --value);
    this.refreshUserList();
  }

  nextPage() {
    this.currentPage.update((value) => ++value);
    this.refreshUserList();
  }

  addUser() {
    this.router.navigate([ADMIN_ADD_USER_ROUTE]);
  }

  editUser(userId: string) {
    this.router.navigate([ADMIN_EDIT_USER_ROUTE, userId]);
  }

  ngOnDestroy() {
    this.getUserListSubscription?.unsubscribe();
  }
}
