import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncumplimientosTurnosComponent } from './incumplimientos-turnos.component';

describe('NovedadesComponent', () => {
  let component: IncumplimientosTurnosComponent;
  let fixture: ComponentFixture<IncumplimientosTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncumplimientosTurnosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncumplimientosTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
