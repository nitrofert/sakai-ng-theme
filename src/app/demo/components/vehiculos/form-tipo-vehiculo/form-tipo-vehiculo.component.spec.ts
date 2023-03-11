import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTipoVehiculoComponent } from './form-tipo-vehiculo.component';

describe('FormTipoVehiculoComponent', () => {
  let component: FormTipoVehiculoComponent;
  let fixture: ComponentFixture<FormTipoVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTipoVehiculoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTipoVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
