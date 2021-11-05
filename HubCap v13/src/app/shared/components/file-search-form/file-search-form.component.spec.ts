import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSearchFormComponent } from './file-search-form.component';

describe('FileSearchFormComponent', () => {
  let component: FileSearchFormComponent;
  let fixture: ComponentFixture<FileSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileSearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
