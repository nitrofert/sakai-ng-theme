import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueSoporteFacturasComponent } from './cargue-soportes-facturas.component';

describe('CargueSoporteFacturasComponent', () => {
  let component: CargueSoporteFacturasComponent;
  let fixture: ComponentFixture<CargueSoporteFacturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargueSoporteFacturasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargueSoporteFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
