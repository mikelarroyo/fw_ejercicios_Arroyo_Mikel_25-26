import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisRecetasCreate } from './mis-recetas-create';

describe('MisRecetasCreate', () => {
  let component: MisRecetasCreate;
  let fixture: ComponentFixture<MisRecetasCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisRecetasCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(MisRecetasCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
