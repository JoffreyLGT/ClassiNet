import { MenuItem } from "./shared/shared.model";

export const HEADER_PAGINATOR_KEY = "X-Paginator";
export const PAGE_NOT_FOUND_ROUTE = "404";
export const HOME_ROUTE = "home";
export const DISCOVER_ROUTE = "discover";
export const ABOUT_MODEL_TRAINING_ROUTE = "about-model-training";
export const CATEGORY_PREDICTION_ROUTE = "product-categorization";

export const DASHBOARD_DATA_VISUALIZATION_ROUTE =
  "dashboard/data-visualization";
export const DASHBOARD_MODEL_PERFORMANCE_ROUTE = "dashboard/model-performance";

export const USER_LOGIN_ROUTE = "user/login";
export const USER_LOGOUT_ROUTE = "user/logout";

export const ADMIN_MODEL_LIST_ROUTE = "admin/models";
export const ADMIN_USER_LIST_ROUTE = "admin/users";
export const ADMIN_ADD_USER_ROUTE = "admin/users/add";
export const ADMIN_EDIT_USER_ROUTE = "admin/users/edit";
export const ADMIN_PRODUCT_LIST_ROUTE = "admin/products";
export const ADMIN_ADD_PRODUCT_ROUTE = "admin/products/add";
export const ADMIN_EDIT_PRODUCT_ROUTE = "admin/products/edit";

export const MENU_ITEM_LOGIN: MenuItem = {
  icon: "logout",
  label: "Log in",
  link: USER_LOGIN_ROUTE,
};

export const MENU_ITEM_LOGOUT: MenuItem = {
  icon: "logout",
  label: "Log out",
  link: "",
};

export const MENU_ITEMS: { name: string; items: MenuItem[] }[] = [
  {
    name: "ClassiNet",
    items: [
      {
        icon: "home-4-line",
        label: "Home",
        link: HOME_ROUTE,
      },
      {
        icon: "planet-line",
        label: "Discover [soon]",
        link: DISCOVER_ROUTE,
      },
      {
        icon: "presentation-line",
        label: "About model training  [soon]",
        link: ABOUT_MODEL_TRAINING_ROUTE,
      },
      {
        icon: "box-3-line",
        label: "Categorize a product",
        link: CATEGORY_PREDICTION_ROUTE,
      },
    ],
  },
  {
    name: "Dashboard",
    items: [
      {
        icon: "pie-chart-line",
        label: "Data visualization",
        link: DASHBOARD_DATA_VISUALIZATION_ROUTE,
      },
      {
        icon: "battery-line",
        label: "Model performance [soon]",
        link: DASHBOARD_MODEL_PERFORMANCE_ROUTE,
      },
    ],
  },
  {
    name: "Administration",
    items: [
      {
        icon: "brain-line",
        label: "Models [soon]",
        link: ADMIN_MODEL_LIST_ROUTE,
      },
      {
        icon: "group-line",
        label: "Users",
        link: ADMIN_USER_LIST_ROUTE,
      },
      {
        icon: "barcode-line",
        label: "Products",
        link: ADMIN_PRODUCT_LIST_ROUTE,
      },
    ],
  },
];

export const USER_ROLES = ["User", "Admin"];
