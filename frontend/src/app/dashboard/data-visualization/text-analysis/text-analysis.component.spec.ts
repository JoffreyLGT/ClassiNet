import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TextAnalysisComponent } from "./text-analysis.component";

describe("DesignationAnalysisComponent", () => {
  let component: TextAnalysisComponent;
  let fixture: ComponentFixture<TextAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAnalysisComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
