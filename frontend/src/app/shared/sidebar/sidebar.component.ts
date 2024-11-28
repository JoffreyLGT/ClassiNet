import { Component } from "@angular/core";
import { MENU_ITEMS } from "../../app.static-data";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgOptimizedImage } from "@angular/common";
import { SvgIconComponent } from "angular-svg-icon";

@Component({
  selector: "app-sidebar",
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive, SvgIconComponent],
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent {
  menu_items = MENU_ITEMS;

  constructor() {}
}
