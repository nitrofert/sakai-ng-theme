import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComportamientoBodegasComponent } from './comportamiento-bodegas.component';

describe('NovedadesComponent', () => {
  let component: ComportamientoBodegasComponent;
  let fixture: ComponentFixture<ComportamientoBodegasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComportamientoBodegasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComportamientoBodegasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
