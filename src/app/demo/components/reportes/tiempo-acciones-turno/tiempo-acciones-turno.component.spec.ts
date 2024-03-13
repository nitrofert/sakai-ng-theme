import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiempoAccionesTurnoComponent } from './tiempo-acciones-turno.component';

describe('NovedadesComponent', () => {
  let component: TiempoAccionesTurnoComponent;
  let fixture: ComponentFixture<TiempoAccionesTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiempoAccionesTurnoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiempoAccionesTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
