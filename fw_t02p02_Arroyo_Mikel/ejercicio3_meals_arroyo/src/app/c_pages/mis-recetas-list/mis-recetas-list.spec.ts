import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisRecetasList } from './mis-recetas-list';

describe('MisRecetasList', () => {
  let component: MisRecetasList;
  let fixture: ComponentFixture<MisRecetasList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisRecetasList],
    }).compileComponents();

    fixture = TestBed.createComponent(MisRecetasList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
