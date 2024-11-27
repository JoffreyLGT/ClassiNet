import { Component, computed, input, output } from "@angular/core";

@Component({
  selector: "app-paginator",
  imports: [],
  templateUrl: "./paginator.component.html",
  styles: ``,
})
export class PaginatorComponent {
  currentPage = input.required<number>();
  lastPage = input.required<number>();
  changePage = output<number>();

  previousPageNumber = computed(() => {
    return this.currentPage() - 1;
  });

  pageList = computed((): (number | null)[] => {
    // TODO: The content of this function could be set in a utilities file
    // TODO: This function is hardcored and should be simplified with recursion
    const currentPage = this.currentPage();

    const nbButtons = 7;

    // Case where there is less pages than buttons
    if (this.lastPage() <= nbButtons) {
      return [...Array(this.lastPage()).keys()].map((i) => i + 1);
    }
    // Case where the current page is near the beginning
    if (currentPage <= nbButtons - 3) {
      const result: (number | null)[] = [...Array(nbButtons - 2).keys()].map(
        (i) => i + 1,
      );
      result.push(null, this.lastPage());
      return result;
    }
    // Case where the current page is near the end
    if (currentPage > this.lastPage() - (nbButtons - 2)) {
      const result = [];
      for (
        let i = this.lastPage();
        i > this.lastPage() - (nbButtons - 2);
        i--
      ) {
        result.unshift(i);
      }
      result.unshift(1, null);
      return result;
    }
    // Case where the page is in between
    return [
      1,
      null,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      null,
      this.lastPage(),
    ];
  });
}
