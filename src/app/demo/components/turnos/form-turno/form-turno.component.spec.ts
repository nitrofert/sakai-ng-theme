import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTurnoComponent } from './form-turno.component';

describe('FormTurnoComponent', () => {
  let component: FormTurnoComponent;
  let fixture: ComponentFixture<FormTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTurnoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
