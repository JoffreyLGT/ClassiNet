import { MenuItem } from "./shared/shared.model";

export const HEADER_PAGINATOR_KEY = "X-Paginator";
export const PAGE_NOT_FOUND_ROUTE = "404";
export const DASHBOARD_HOME_ROUTE = "dashboard/home";
export const DASHBOARD_DATA_VISUALIZATION_ROUTE =
  "dashboard/data-visualization";
export const DASHBOARD_MODEL_PERFORMANCE_ROUTE = "dashboard/model-performance";

export const USER_LOGIN_ROUTE = "user/login";
export const USER_LOGOUT_ROUTE = "user/logout";

export const CATEGORIZATION_PRODUCT_ROUTE = "categorization/product";

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
    name: "Dashboard",
    items: [
      {
        icon: "home",
        label: "Home",
        link: DASHBOARD_HOME_ROUTE,
      },
      {
        icon: "chart-pie",
        label: "Data visualization",
        link: DASHBOARD_DATA_VISUALIZATION_ROUTE,
      },
      {
        icon: "battery",
        label: "Model performance",
        link: DASHBOARD_MODEL_PERFORMANCE_ROUTE,
      },
    ],
  },
  {
    name: "Categorization",
    items: [
      {
        icon: "brain",
        label: "Categorize a product",
        link: CATEGORIZATION_PRODUCT_ROUTE,
      },
    ],
  },
  {
    name: "Administration",
    items: [
      {
        icon: "users",
        label: "Users",
        link: ADMIN_USER_LIST_ROUTE,
      },
      {
        icon: "barcode",
        label: "Products",
        link: ADMIN_PRODUCT_LIST_ROUTE,
      },
    ],
  },
];

export const USER_ROLES = ["User", "Admin"];
