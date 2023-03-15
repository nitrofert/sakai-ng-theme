import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPermisosComponent } from './form-permisos.component';

describe('FormPermisosComponent', () => {
  let component: FormPermisosComponent;
  let fixture: ComponentFixture<FormPermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPermisosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
