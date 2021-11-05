import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxDocumentPreviewComponent } from './box-document-preview.component';

describe('BoxDocumentPreviewComponent', () => {
  let component: BoxDocumentPreviewComponent;
  let fixture: ComponentFixture<BoxDocumentPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxDocumentPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxDocumentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
