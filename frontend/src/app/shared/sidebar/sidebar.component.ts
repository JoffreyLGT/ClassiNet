import { Component } from "@angular/core";
import { UserCardComponent } from "./user-card/user-card.component";
import { MenuSectionComponent } from "./menu-section/menu-section.component";
import { MenuItemComponent } from "./menu-item/menu-item.component";
import { MENU_ITEM_LOGOUT, MENU_ITEMS } from "../../app.static-data";

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
      @for (section of menu_items; track section.name) {
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

  menu_items = MENU_ITEMS;
  logout = MENU_ITEM_LOGOUT;
}
