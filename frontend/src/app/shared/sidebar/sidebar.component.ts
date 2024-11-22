import { Component, OnDestroy } from "@angular/core";
import { UserCardComponent } from "./user-card/user-card.component";
import {
  DASHBOARD_HOME_ROUTE,
  MENU_ITEM_LOGIN,
  MENU_ITEM_LOGOUT,
  MENU_ITEMS,
} from "../../app.static-data";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { Subscription } from "rxjs";
import { UserService } from "../../services/user/user.service";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-sidebar",
  imports: [UserCardComponent, NgOptimizedImage, RouterLink, RouterLinkActive],
  template: `
    <nav
      class="flex h-dvh w-64 flex-col gap-4 border-r border-neutral bg-accent"
    >
      <h1 class="mx-auto mt-4">
        <img
          ngSrc="logo-small.png"
          width="208"
          height="67"
          alt="Product Categorization"
        />
      </h1>
      <app-user-card [user]="userService.user()" />

      <ul class="menu menu-sm rounded-box">
        @for (section of menu_items; track section.name) {
          <li class="my-2">
            <details open>
              <summary class="text-sm font-light uppercase">
                {{ section.name }}
              </summary>
              <ul>
                @for (item of section.items; track item.label) {
                  <li>
                    <a
                      routerLink="{{ item.link }}"
                      routerLinkActive="active"
                      ariaCurrentWhenActive="page"
                      ><img
                        ngSrc="{{ item.icon }}.svg"
                        width="24"
                        height="24"
                        alt="{{ item.label }} icon"
                      />
                      {{ item.label }}</a
                    >
                  </li>
                }
              </ul>
            </details>
          </li>
        }
      </ul>

      <div class="mb-10 grow place-content-end">
        <ul class="menu rounded-box">
          <li>
            @if (
              userService.user() === null || userService.user() === undefined
            ) {
              <a
                routerLink="{{ menu_login.link }}"
                routerLinkActive="active"
                ariaCurrentWhenActive="page"
                ><img
                  ngSrc="{{ menu_login.icon }}.svg"
                  width="24"
                  height="24"
                  alt="{{ menu_login.label }} icon"
                />
                {{ menu_login.label }}</a
              >
            } @else {
              <button (click)="logout()" class="menu rounded-box">
                <img
                  ngSrc="{{ menu_logout.icon }}.svg"
                  width="24"
                  height="24"
                  alt="{{ menu_logout.label }} icon"
                />
                {{ menu_logout.label }}
              </button>
            }
          </li>
        </ul>
      </div>
    </nav>
  `,
})
export class SidebarComponent implements OnDestroy {
  menu_items = MENU_ITEMS;
  menu_login = MENU_ITEM_LOGIN;
  menu_logout = MENU_ITEM_LOGOUT;

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
