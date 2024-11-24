import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { SvgIconComponent } from "angular-svg-icon";

@Component({
  selector: "app-under-construction",
  imports: [SvgIconComponent],
  template: `
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content flex-col">
        <svg-icon
          src="icons/under-construction.svg"
          svgClass="w-4 opacity-70 w-96 h-80"
        />
        <div class="text-center">
          <h1 class="text-5xl font-bold">Under construction</h1>
          <p class="py-6">
            This page is not ready yet, please try again later.
          </p>
          <button class="btn btn-primary" (click)="goToPreviousPage()">
            Back to the previous page
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class UnderConstructionComponent {
  constructor(private location: Location) {}

  goToPreviousPage(): void {
    this.location.back();
  }
}
