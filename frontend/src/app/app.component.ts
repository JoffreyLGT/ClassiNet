import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SidebarComponent } from "./shared/sidebar/sidebar.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex">
      <app-sidebar />
      <div class="container mx-2">
        <router-outlet></router-outlet>
        <div></div>
      </div>
    </div>
  `,
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "Product classification";
}
