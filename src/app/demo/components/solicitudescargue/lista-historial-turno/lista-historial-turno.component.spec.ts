import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaHistorialTurnoComponent } from './lista-historial-turno.component';

describe('ListaHistorialTurnoComponent', () => {
  let component: ListaHistorialTurnoComponent;
  let fixture: ComponentFixture<ListaHistorialTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaHistorialTurnoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaHistorialTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
