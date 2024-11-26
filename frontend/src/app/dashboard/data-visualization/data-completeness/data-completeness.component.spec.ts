import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataCompletenessComponent } from "./data-completeness.component";

describe("DataCompletenessComponent", () => {
  let component: DataCompletenessComponent;
  let fixture: ComponentFixture<DataCompletenessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataCompletenessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataCompletenessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
