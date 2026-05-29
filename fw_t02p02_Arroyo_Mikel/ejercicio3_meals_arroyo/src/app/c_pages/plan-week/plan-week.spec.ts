import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanWeek } from './plan-week';

describe('PlanWeek', () => {
  let component: PlanWeek;
  let fixture: ComponentFixture<PlanWeek>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanWeek],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanWeek);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
