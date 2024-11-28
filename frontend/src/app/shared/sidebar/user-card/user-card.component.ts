import { Component, input } from "@angular/core";
import { UserModel } from "../../../user/user.model";

@Component({
  selector: "app-user-card",
  imports: [],
  template: `
    <div class="card m-2 bg-base-100 shadow-xl">
      <div class="card-body p-4">
        <div class="flex gap-3">
          <div class="avatar placeholder">
            <div class="w-16 rounded-full bg-primary text-neutral-content">
              <span class="text-xl">{{
                user()?.userName?.charAt(0)?.toUpperCase() ?? "G"
              }}</span>
            </div>
          </div>
          <div class="flex flex-col place-content-center">
            @if (user() !== null && user() !== undefined) {
              <span class="text-ellipsis">{{ user()?.userName }}</span>
              <span class="text-ellipsis">{{ user()?.company }}</span>
            } @else {
              <span class="text-ellipsis">Guest</span>
              <span class="text-ellipsis text-sm italic"
                >Log in to see more</span
              >
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UserCardComponent {
  user = input<UserModel | null | undefined>();
}
