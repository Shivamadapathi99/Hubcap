import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSearchRecentFilesComponent } from './file-search-recent-files.component';

describe('FileSearchRecentFilesComponent', () => {
  let component: FileSearchRecentFilesComponent;
  let fixture: ComponentFixture<FileSearchRecentFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileSearchRecentFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSearchRecentFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
