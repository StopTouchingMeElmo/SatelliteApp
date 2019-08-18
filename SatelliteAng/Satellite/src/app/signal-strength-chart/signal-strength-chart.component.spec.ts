import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalStrengthChartComponent } from './signal-strength-chart.component';

describe('SignalStrengthChartComponent', () => {
  let component: SignalStrengthChartComponent;
  let fixture: ComponentFixture<SignalStrengthChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignalStrengthChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalStrengthChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
