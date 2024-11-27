import { MenuItem } from "./shared/sidebar/menu-item.model";

export const DASHBOARD_HOME_ROUTE = "dashboard/home";
export const DASHBOARD_DATA_VISUALIZATION_ROUTE =
  "dashboard/data-visualization";
export const DASHBOARD_MODEL_PERFORMANCE_ROUTE = "dashboard/model-performance";

export const USER_LOGIN_ROUTE = "user/login";
export const USER_LOGOUT_ROUTE = "user/logout";

export const CATEGORIZATION_PRODUCT_ROUTE = "categorization/product";

export const ADMIN_USERS_ROUTE = "admin/users";
export const ADMIN_ADD_USER_ROUTE = "admin/users/add";
export const ADMIN_EDIT_USER_ROUTE = "admin/users/edit";
export const ADMIN_PRODUCTS_ROUTE = "admin/products";

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
        link: ADMIN_USERS_ROUTE,
      },
      {
        icon: "barcode",
        label: "Products",
        link: ADMIN_PRODUCTS_ROUTE,
      },
    ],
  },
];
