import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAccionesComponent } from './form-acciones.component';

describe('FormAccionesComponent', () => {
  let component: FormAccionesComponent;
  let fixture: ComponentFixture<FormAccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAccionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
