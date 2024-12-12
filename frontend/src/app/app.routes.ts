import { Routes } from "@angular/router";
import { LoginComponent } from "./user/login/login.component";
import {
  ADMIN_ADD_PRODUCT_ROUTE,
  ADMIN_ADD_USER_ROUTE,
  ADMIN_EDIT_PRODUCT_ROUTE,
  ADMIN_EDIT_USER_ROUTE,
  ADMIN_PRODUCT_LIST_ROUTE,
  ADMIN_USER_LIST_ROUTE,
  CATEGORY_PREDICTION_ROUTE,
  DASHBOARD_DATA_VISUALIZATION_ROUTE,
  DASHBOARD_HOME_ROUTE,
  DASHBOARD_MODEL_PERFORMANCE_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
  USER_LOGIN_ROUTE,
  USER_LOGOUT_ROUTE,
} from "./app.static-data";
import { UnderConstructionComponent } from "./shared/under-construction/under-construction.component";
import { isLoggedInGuard } from "./guards/is-logged-in.guard";
import { HomeComponent } from "./home/home.component";
import { DataVisualizationComponent } from "./dashboard/data-visualization/data-visualization.component";
import { UserManagementComponent } from "./user/user-management/user-management.component";
import { EditUserComponent } from "./user/edit-user/edit-user.component";
import { ProductManagementComponent } from "./product/product-management/product-management.component";
import { EditProductComponent } from "./product/edit-product/edit-product.component";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { CategoryPredictionComponent } from "./prediction/category-prediction/category-prediction.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: USER_LOGIN_ROUTE,
    pathMatch: "full",
  },
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
    component: HomeComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: DASHBOARD_DATA_VISUALIZATION_ROUTE,
    component: DataVisualizationComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: DASHBOARD_MODEL_PERFORMANCE_ROUTE,
    component: UnderConstructionComponent,
    canActivate: [isLoggedInGuard],
  },
  // CATEGORIZATION ROUTES
  {
    path: CATEGORY_PREDICTION_ROUTE,
    component: CategoryPredictionComponent,
    canActivate: [isLoggedInGuard],
  },
  // ADMINISTRATION ROUTES
  {
    path: ADMIN_PRODUCT_LIST_ROUTE,
    component: ProductManagementComponent,
    canActivate: [isLoggedInGuard],
    title: "Product management",
  },
  {
    path: `${ADMIN_EDIT_PRODUCT_ROUTE}/:id`,
    component: EditProductComponent,
    canActivate: [isLoggedInGuard],
    title: "Edit product",
  },
  {
    path: ADMIN_ADD_PRODUCT_ROUTE,
    component: EditProductComponent,
    canActivate: [isLoggedInGuard],
    title: "Add product",
  },
  {
    path: ADMIN_USER_LIST_ROUTE,
    component: UserManagementComponent,
    canActivate: [isLoggedInGuard],
    title: "User management",
  },
  {
    path: `${ADMIN_EDIT_USER_ROUTE}/:id`,
    component: EditUserComponent,
    canActivate: [isLoggedInGuard],
    title: "Edit user",
  },
  {
    path: ADMIN_ADD_USER_ROUTE,
    component: EditUserComponent,
    canActivate: [isLoggedInGuard],
    title: "Add user",
  },
  {
    path: PAGE_NOT_FOUND_ROUTE,
    component: NotFoundComponent,
  },
  {
    path: "**",
    component: NotFoundComponent,
    title: "Page not found",
  },
];
