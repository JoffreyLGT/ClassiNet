import { Component } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";
import { SvgIconComponent } from "angular-svg-icon";
import {
  DASHBOARD_HOME_ROUTE,
  MENU_ITEM_LOGIN,
  MENU_ITEM_LOGOUT,
  USER_LOGIN_ROUTE,
} from "../../app.static-data";
import { Subscription } from "rxjs";
import { UserService } from "../../user/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  imports: [NgOptimizedImage, SvgIconComponent],
  templateUrl: "./navbar.component.html",
  styles: ``,
})
export class NavbarComponent {
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

  login() {
    this.router.navigate([USER_LOGIN_ROUTE]).then();
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
    this.router.navigate([DASHBOARD_HOME_ROUTE]).then();
  }

  ngOnDestroy(): void {
    this.logoutSubscription?.unsubscribe();
  }
}
