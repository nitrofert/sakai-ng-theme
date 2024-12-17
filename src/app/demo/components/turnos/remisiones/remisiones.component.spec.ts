import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemisionesComponent } from './remisiones.component';

describe('RemisionesComponent', () => {
  let component: RemisionesComponent;
  let fixture: ComponentFixture<RemisionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemisionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
