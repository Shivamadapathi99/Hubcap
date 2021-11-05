import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxFileUploaderComponent } from './box-file-uploader.component';

describe('BoxFileUploaderComponent', () => {
  let component: BoxFileUploaderComponent;
  let fixture: ComponentFixture<BoxFileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxFileUploaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
