import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToneladasAdicionalesComponent } from './toneladas-adicionales.component';

describe('NovedadesComponent', () => {
  let component: ToneladasAdicionalesComponent;
  let fixture: ComponentFixture<ToneladasAdicionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToneladasAdicionalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToneladasAdicionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
