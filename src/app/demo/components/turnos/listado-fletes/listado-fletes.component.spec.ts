import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoFletesComponent } from './listado-fletes.component';

describe('ListadoFletesComponent', () => {
  let component: ListadoFletesComponent;
  let fixture: ComponentFixture<ListadoFletesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoFletesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoFletesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
