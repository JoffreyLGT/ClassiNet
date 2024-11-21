import { Component } from "@angular/core";

@Component({
  selector: "app-under-construction",
  imports: [],
  template: `
    <section class="m-6 h-full">
      <h2 class="text-3xl">Under construction</h2>
      <img
        src="under-construction.svg"
        alt="Under construction"
        class="my-6 max-w-[45rem]"
      />
      <p>This page is under construction, please come back later.</p>
    </section>
  `,
  styles: ``,
})
export class UnderConstructionComponent {}
