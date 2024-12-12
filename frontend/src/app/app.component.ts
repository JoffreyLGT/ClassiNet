import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { ThemeManagerService } from "./shared/theme-manager/theme-manager.service";
import { FooterComponent } from "./shared/footer/footer.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, FooterComponent],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  title = "ClassiNet";

  themeManagerService: ThemeManagerService;

  constructor(themeManagerService: ThemeManagerService) {
    this.themeManagerService = themeManagerService;
  }
}
