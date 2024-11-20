import { Component, input } from "@angular/core";
import { MenuItem } from "./menu-item";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-menu-item",
  imports: [RouterLink],
  template: `
    <li class="flex">
      <a
        class="flex"
        routerLink="{{ menuItem().link }}"
        routerLinkActive="active"
        ariaCurrentWhenActive="page"
      >
        <img
          src="{{ menuItem().icon }}.svg"
          alt="{{ menuItem().icon }} icon"
        /><span class="ml-1">{{ menuItem().label }}</span>
      </a>
    </li>
  `,
  styles: ``,
})
export class MenuItemComponent {
  menuItem = input.required<MenuItem>();
}
