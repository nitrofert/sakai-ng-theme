import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionGerenciasComponent } from './programacion-gerencias.component';

describe('ProgramacionGerenciasComponent', () => {
  let component: ProgramacionGerenciasComponent;
  let fixture: ComponentFixture<ProgramacionGerenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramacionGerenciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramacionGerenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
