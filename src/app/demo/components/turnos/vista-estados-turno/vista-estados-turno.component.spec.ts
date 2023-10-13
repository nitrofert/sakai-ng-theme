import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaEstadosTurnoComponent } from './vista-estados-turno.component';

describe('VistaEstadosTurnoComponent', () => {
  let component: VistaEstadosTurnoComponent;
  let fixture: ComponentFixture<VistaEstadosTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaEstadosTurnoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaEstadosTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
