import { Component, input } from "@angular/core";
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { MenuItem } from "../menu-item/menu-item";

@Component({
  selector: "app-menu-section",
  imports: [MenuItemComponent],
  template: `
    <ol class="mx-4">
      <li class="mb-2 text-sm font-light uppercase">{{ name() }}</li>
      @for (item of items(); track item.label) {
        <app-menu-item [menuItem]="item" />
      }
    </ol>
  `,
  styles: ``,
})
export class MenuSectionComponent {
  name = input("");
  items = input<MenuItem[]>([]);
}
