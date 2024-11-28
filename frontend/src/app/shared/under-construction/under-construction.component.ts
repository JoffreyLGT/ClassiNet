import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { SvgIconComponent } from "angular-svg-icon";

@Component({
  selector: "app-under-construction",
  imports: [SvgIconComponent],
  templateUrl: "./under-construction.component.html",
  styles: ``,
})
export class UnderConstructionComponent {
  constructor(private location: Location) {}

  goToPreviousPage(): void {
    this.location.back();
  }
}
