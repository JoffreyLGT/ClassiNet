import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  title = "Product classification";
}
