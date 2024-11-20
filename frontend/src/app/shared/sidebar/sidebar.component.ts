import { Component } from "@angular/core";
import { UserCardComponent } from "./user-card/user-card.component";
import { MenuSectionComponent } from "./menu-section/menu-section.component";
import { MenuItem } from "./menu-item/menu-item";
import { MenuItemComponent } from "./menu-item/menu-item.component";

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
      <app-user-card [username]="username" [company]="company" />
      @for (section of sections; track section.name) {
        <app-menu-section [name]="section.name" [items]="section.items" />
      }

      <ol class="mx-4 mb-10 grow place-content-end">
        <app-menu-item [menuItem]="logout" />
      </ol>
    </nav>
  `,
})
export class SidebarComponent {
  username = "Hervé Dumon";
  company = "ACME Corporation";
  logout: MenuItem = {
    icon: "logout",
    label: "Logout",
    link: "/users/logout",
  };
  sections: { name: string; items: MenuItem[] }[] = [
    {
      name: "Dashboard",
      items: [
        {
          icon: "home",
          label: "Home",
          link: "/dashboard/home",
        },
        {
          icon: "chart-pie",
          label: "Data visualization",
          link: "/dashboard/data-visualization",
        },
        {
          icon: "battery",
          label: "Model performance",
          link: "/dashboard/model-performance",
        },
      ],
    },
    {
      name: "Categorization",
      items: [
        {
          icon: "brain",
          label: "Categorize a product",
          link: "/categorization/product",
        },
      ],
    },
    {
      name: "Administration",
      items: [
        {
          icon: "users",
          label: "Users",
          link: "/administration/users",
        },
        {
          icon: "barcode",
          label: "Products",
          link: "/administration/products",
        },
      ],
    },
  ];
}
