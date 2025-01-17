import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaSolicitudEntregaComponent } from './nueva-solicitud-entrega.component';

describe('NuevaSolicitudComponent', () => {
  let component: NuevaSolicitudEntregaComponent;
  let fixture: ComponentFixture<NuevaSolicitudEntregaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevaSolicitudEntregaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaSolicitudEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
