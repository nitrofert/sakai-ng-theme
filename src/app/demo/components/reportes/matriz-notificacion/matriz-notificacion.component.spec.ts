import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizNotificacionComponent } from './matriz-notificacion.component';

describe('MatrizNotificacionComponent', () => {
  let component: MatrizNotificacionComponent;
  let fixture: ComponentFixture<MatrizNotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrizNotificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrizNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
