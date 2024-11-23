import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SidebarComponent } from "./shared/sidebar/sidebar.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex">
      <app-sidebar />
      <div class="container bg-base-200">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "Product classification";
}
