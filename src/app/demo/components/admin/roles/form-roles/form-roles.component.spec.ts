import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRolesComponent } from './form-roles.component';

describe('FormRolesComponent', () => {
  let component: FormRolesComponent;
  let fixture: ComponentFixture<FormRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
