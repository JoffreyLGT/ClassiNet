import { Component, input } from "@angular/core";
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { MENU_ITEM_LOGIN } from "../../../app.static-data";
import { User } from "../../../models/user";

@Component({
  selector: "app-user-card",
  imports: [MenuItemComponent],
  template: `
    <div class="flex gap-3 border-y-2 border-blue-100 p-3">
      <img src="user.png" alt="User avatar" class="h-14" />
      <div class="flex flex-col place-content-center">
        @if (user() !== null && user() !== undefined) {
          <span class="text-ellipsis">{{ user()?.userName }}</span>
          <span class="text-ellipsis">{{ user()?.company }}</span>
        } @else {
          <span class="text-ellipsis">Guest</span>
          <app-menu-item [menuItem]="loginMenuItem" />
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class UserCardComponent {
  loginMenuItem = MENU_ITEM_LOGIN;

  user = input<User | null | undefined>();
}
