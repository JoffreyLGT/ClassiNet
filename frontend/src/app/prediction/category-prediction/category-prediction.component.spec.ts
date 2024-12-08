import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPredictionComponent } from './category-prediction.component';

describe('CategoryPredictionComponent', () => {
  let component: CategoryPredictionComponent;
  let fixture: ComponentFixture<CategoryPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryPredictionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
