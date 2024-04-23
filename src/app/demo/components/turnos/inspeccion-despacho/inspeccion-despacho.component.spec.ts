import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspeccionDespachoComponent } from './inspeccion-despacho.component';

describe('FormTurnoComponent', () => {
  let component: InspeccionDespachoComponent;
  let fixture: ComponentFixture<InspeccionDespachoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspeccionDespachoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspeccionDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
