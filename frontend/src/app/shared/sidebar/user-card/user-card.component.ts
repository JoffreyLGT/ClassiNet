import { Component, input } from "@angular/core";

@Component({
  selector: "app-user-card",
  imports: [],
  template: `
    <div class="flex gap-3 border-y-2 border-blue-100 p-3">
      <img src="user.png" alt="User avatar" class="h-14" />
      <div class="flex flex-col place-content-center">
        <span class="text-ellipsis">{{ username() }}</span>
        <span class="text-ellipsis">{{ company() }}</span>
      </div>
    </div>
  `,
  styles: ``,
})
export class UserCardComponent {
  username = input<string>("");
  company = input<string>("");
}
