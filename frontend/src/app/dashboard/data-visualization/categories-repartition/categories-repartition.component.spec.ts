import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesRepartitionComponent } from './categories-repartition.component';

describe('CategoriesRepartitionComponent', () => {
  let component: CategoriesRepartitionComponent;
  let fixture: ComponentFixture<CategoriesRepartitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesRepartitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesRepartitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
