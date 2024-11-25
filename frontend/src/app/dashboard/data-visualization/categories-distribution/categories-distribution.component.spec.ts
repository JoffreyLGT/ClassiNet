import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CategoriesDistributionComponent } from "./categories-distribution.component";

describe("CategoriesRepartitionComponent", () => {
  let component: CategoriesDistributionComponent;
  let fixture: ComponentFixture<CategoriesDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesDistributionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
