import { Component, inject, OnDestroy } from "@angular/core";
import { UserCardComponent } from "./user-card/user-card.component";
import { MenuSectionComponent } from "./menu-section/menu-section.component";
import { MenuItemComponent } from "./menu-item/menu-item.component";
import { DASHBOARD_HOME_ROUTE, MENU_ITEMS } from "../../app.static-data";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { UserService } from "../../services/user/user.service";

@Component({
  selector: "app-sidebar",
  imports: [UserCardComponent, MenuSectionComponent, MenuItemComponent],
  template: `
    <nav
      class="flex h-dvh w-64 flex-col gap-4 border-r-2 border-blue-100 bg-blue-300"
    >
      <h1 class="mx-auto mt-4 max-w-52">
        <img src="logo-small.png" alt="Product Categorization" />
      </h1>
      <app-user-card [user]="userService.user()" />
      @for (section of menu_items; track section.name) {
        <app-menu-section [name]="section.name" [items]="section.items" />
      }

      <ol class="mx-4 mb-10 grow place-content-end">
        <button class="flex" (click)="logout()">
          <img src="logout.svg" alt="Logout icon" /><span class="ml-1"
            >Logout</span
          >
        </button>
      </ol>
    </nav>
  `,
})
export class SidebarComponent implements OnDestroy {
  menu_items = MENU_ITEMS;

  private logoutSubscription: Subscription | null = null;

  userService: UserService;

  constructor(
    userService: UserService,
    private router: Router,
  ) {
    this.userService = userService;
  }

  logout() {
    this.logoutSubscription = this.userService.logout().subscribe({
      next: (_) => {
        this.navigateToHome();
      },
      error: (_) => {
        this.navigateToHome();
      },
    });
  }

  navigateToHome() {
    this.router.navigate([DASHBOARD_HOME_ROUTE]);
  }

  ngOnDestroy(): void {
    this.logoutSubscription?.unsubscribe();
  }
}
