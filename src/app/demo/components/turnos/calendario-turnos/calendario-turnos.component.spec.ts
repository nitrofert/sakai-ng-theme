import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioTurnosComponent } from './calendario-turnos.component';

describe('CalendarioTurnosComponent', () => {
  let component: CalendarioTurnosComponent;
  let fixture: ComponentFixture<CalendarioTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarioTurnosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
