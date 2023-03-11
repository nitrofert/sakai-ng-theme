import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTransportadoraComponent } from './form-transportadora.component';

describe('FormTransportadoraComponent', () => {
  let component: FormTransportadoraComponent;
  let fixture: ComponentFixture<FormTransportadoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTransportadoraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTransportadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
