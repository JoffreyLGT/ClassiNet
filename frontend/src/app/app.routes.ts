import { Routes } from "@angular/router";
import { LoginComponent } from "./user/login/login.component";
import {
  ADMIN_PRODUCTS_ROUTE,
  ADMIN_USERS_ROUTE,
  CATEGORIZATION_PRODUCT_ROUTE,
  DASHBOARD_DATA_VISUALIZATION_ROUTE,
  DASHBOARD_HOME_ROUTE,
  DASHBOARD_MODEL_PERFORMANCE_ROUTE,
  USER_LOGIN_ROUTE,
  USER_LOGOUT_ROUTE,
} from "./app.static-data";
import { UnderConstructionComponent } from "./shared/under-construction/under-construction.component";

export const routes: Routes = [
  // USER ROUTES
  {
    path: USER_LOGIN_ROUTE,
    component: LoginComponent,
  },
  {
    path: USER_LOGOUT_ROUTE,
    component: UnderConstructionComponent,
  },
  // DASHBOARD ROUTES
  {
    path: DASHBOARD_HOME_ROUTE,
    component: UnderConstructionComponent,
  },
  {
    path: DASHBOARD_DATA_VISUALIZATION_ROUTE,
    component: UnderConstructionComponent,
  },
  {
    path: DASHBOARD_MODEL_PERFORMANCE_ROUTE,
    component: UnderConstructionComponent,
  },
  // CATEGORIZATION ROUTES
  {
    path: CATEGORIZATION_PRODUCT_ROUTE,
    component: UnderConstructionComponent,
  },
  // ADMINISTRATION ROUTES
  {
    path: ADMIN_PRODUCTS_ROUTE,
    component: UnderConstructionComponent,
  },
  {
    path: ADMIN_USERS_ROUTE,
    component: UnderConstructionComponent,
  },
];
