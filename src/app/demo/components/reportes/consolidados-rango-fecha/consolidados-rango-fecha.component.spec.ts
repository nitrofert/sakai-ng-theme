import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidadosRangoFechaComponent } from './consolidados-rango-fecha.component';

describe('ConsolidadosRangoFechaComponent', () => {
  let component: ConsolidadosRangoFechaComponent;
  let fixture: ComponentFixture<ConsolidadosRangoFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsolidadosRangoFechaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidadosRangoFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
