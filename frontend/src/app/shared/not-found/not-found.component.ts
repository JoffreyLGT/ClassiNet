import { Component } from "@angular/core";
import { SvgIconComponent } from "angular-svg-icon";
import { Location } from "@angular/common";

@Component({
  selector: "app-not-found",
  imports: [SvgIconComponent],
  templateUrl: "./not-found.component.html",
  styles: ``,
})
export class NotFoundComponent {
  constructor(private location: Location) {}

  goToPreviousPage(): void {
    this.location.back();
  }
}
