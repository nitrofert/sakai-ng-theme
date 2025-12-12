import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoPedidosComponent } from './listado-pedidos.component';


describe('PedidosAbiertosComponent', () => {
  let component: ListadoPedidosComponent;
  let fixture: ComponentFixture<ListadoPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoPedidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
