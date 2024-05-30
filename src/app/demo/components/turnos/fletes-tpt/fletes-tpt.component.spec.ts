import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FletesTptComponent } from './fletes-tpt.component';

describe('FletesTptComponent', () => {
  let component: FletesTptComponent;
  let fixture: ComponentFixture<FletesTptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FletesTptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FletesTptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
