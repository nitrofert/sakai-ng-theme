import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosTurnoComponent } from './documentos-turno.component';

describe('DocumentosTurnoComponent', () => {
  let component: DocumentosTurnoComponent;
  let fixture: ComponentFixture<DocumentosTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentosTurnoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
