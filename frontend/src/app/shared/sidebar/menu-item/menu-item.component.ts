import { Component, input } from "@angular/core";
import { MenuItem } from "./menu-item";

@Component({
  selector: "app-menu-item",
  imports: [],
  template: `
    <li class="flex">
      <img
        src="{{ menuItem().icon }}.svg"
        alt="{{ menuItem().icon }} icon"
      /><span class="ml-1">{{ menuItem().label }}</span>
    </li>
  `,
  styles: ``,
})
export class MenuItemComponent {
  menuItem = input.required<MenuItem>();
}
