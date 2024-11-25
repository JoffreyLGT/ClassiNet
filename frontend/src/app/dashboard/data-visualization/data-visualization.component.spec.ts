import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataVisualizationComponent } from './data-visualization.component';

describe('DataVisualizationComponent', () => {
  let component: DataVisualizationComponent;
  let fixture: ComponentFixture<DataVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataVisualizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
