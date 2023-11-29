import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionBodegaComponent } from './programacion-bodega.component';

describe('ProgramacionBodegaComponent', () => {
  let component: ProgramacionBodegaComponent;
  let fixture: ComponentFixture<ProgramacionBodegaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramacionBodegaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramacionBodegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
