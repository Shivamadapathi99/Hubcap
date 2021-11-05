import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTreeViewerComponent } from './file-tree-viewer.component';

describe('FileTreeViewerComponent', () => {
  let component: FileTreeViewerComponent;
  let fixture: ComponentFixture<FileTreeViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileTreeViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTreeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
