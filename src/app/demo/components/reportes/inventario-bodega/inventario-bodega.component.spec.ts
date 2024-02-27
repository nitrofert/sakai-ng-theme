import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioBodegaComponent } from './inventario-bodega.component';

describe('InventarioBodegaComponent', () => {
  let component: InventarioBodegaComponent;
  let fixture: ComponentFixture<InventarioBodegaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventarioBodegaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioBodegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
