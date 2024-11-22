import { Component } from "@angular/core";
import { Location, NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-under-construction",
  imports: [NgOptimizedImage],
  template: `
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content flex-col">
        <img
          ngSrc="under-construction.svg"
          alt="Shoes"
          width="400"
          height="360"
          class="rounded-xl"
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
