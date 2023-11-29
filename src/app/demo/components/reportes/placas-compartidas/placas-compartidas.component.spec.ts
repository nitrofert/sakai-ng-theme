import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacasCompartidasComponent } from './placas-compartidas.component';

describe('PlacasCompartidasComponent', () => {
  let component: PlacasCompartidasComponent;
  let fixture: ComponentFixture<PlacasCompartidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacasCompartidasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacasCompartidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
