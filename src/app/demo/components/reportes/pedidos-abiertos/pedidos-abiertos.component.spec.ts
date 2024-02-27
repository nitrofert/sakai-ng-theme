import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosAbiertosComponent } from './pedidos-abiertos.component';

describe('PedidosAbiertosComponent', () => {
  let component: PedidosAbiertosComponent;
  let fixture: ComponentFixture<PedidosAbiertosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosAbiertosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosAbiertosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
