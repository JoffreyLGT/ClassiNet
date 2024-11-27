import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "../user/user.service";
import { inject } from "@angular/core";
import { USER_LOGIN_ROUTE } from "../app.static-data";
import { catchError, map } from "rxjs";

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.user() === undefined) {
    return userService.getInfo().pipe(
      map((_) => {
        return true;
      }),
      catchError((_) => router.navigate([USER_LOGIN_ROUTE])),
    );
  }
  if (userService.user() === null) {
    router.navigate([USER_LOGIN_ROUTE]);
  }
  return true;
};
