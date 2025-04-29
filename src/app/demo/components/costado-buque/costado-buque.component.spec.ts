import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostadoBuqueComponent } from './costado-buque.component';

describe('CostadoBuqueComponent', () => {
  let component: CostadoBuqueComponent;
  let fixture: ComponentFixture<CostadoBuqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostadoBuqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostadoBuqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
