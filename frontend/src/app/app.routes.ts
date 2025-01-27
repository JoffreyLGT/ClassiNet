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
  HOME_ROUTE,
  DASHBOARD_MODEL_PERFORMANCE_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
  USER_LOGIN_ROUTE,
  USER_LOGOUT_ROUTE,
  DISCOVER_ROUTE,
  ABOUT_MODEL_TRAINING_ROUTE,
  ADMIN_MODEL_LIST_ROUTE,
  ADMIN_EDIT_MODEL_ROUTE,
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
import { ModelManagementComponent } from "./model/model-management/model-management.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: HOME_ROUTE,
    pathMatch: "full",
  },
  // PUBLIC ROUTES
  {
    path: HOME_ROUTE,
    component: HomeComponent,
    title: "Home",
  },
  {
    path: DISCOVER_ROUTE,
    component: UnderConstructionComponent,
    title: "Discover",
  },
  {
    path: ABOUT_MODEL_TRAINING_ROUTE,
    component: UnderConstructionComponent,
    title: "About model training",
  },
  // CATEGORIZATION ROUTES
  {
    path: CATEGORY_PREDICTION_ROUTE,
    component: CategoryPredictionComponent,
    canActivate: [isLoggedInGuard],
    title: "Categorize a product",
  },

  // USER ROUTES
  {
    path: USER_LOGIN_ROUTE,
    component: LoginComponent,
    title: "Log in",
  },
  {
    path: USER_LOGOUT_ROUTE,
    component: UnderConstructionComponent,
    title: "Log out",
  },
  // DASHBOARD ROUTES
  {
    path: DASHBOARD_DATA_VISUALIZATION_ROUTE,
    component: DataVisualizationComponent,
    canActivate: [isLoggedInGuard],
    title: "Data visualization",
  },
  {
    path: DASHBOARD_MODEL_PERFORMANCE_ROUTE,
    component: UnderConstructionComponent,
    canActivate: [isLoggedInGuard],
    title: "Model performance",
  },
  // ADMINISTRATION ROUTES
  {
    path: ADMIN_MODEL_LIST_ROUTE,
    component: ModelManagementComponent,
    canActivate: [isLoggedInGuard],
    title: "Model management",
  },
  {
    path: `${ADMIN_EDIT_MODEL_ROUTE}/:id`,
    component: UnderConstructionComponent,
    canActivate: [isLoggedInGuard],
    title: "Edit MODEL",
  },
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
