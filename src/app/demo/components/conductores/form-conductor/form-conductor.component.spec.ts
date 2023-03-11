import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConductorComponent } from './form-conductor.component';

describe('FormConductorComponent', () => {
  let component: FormConductorComponent;
  let fixture: ComponentFixture<FormConductorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormConductorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormConductorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
