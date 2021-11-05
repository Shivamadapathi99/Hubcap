import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSearchResultItemComponent } from './file-search-result-item.component';

describe('FileSearchResultItemComponent', () => {
  let component: FileSearchResultItemComponent;
  let fixture: ComponentFixture<FileSearchResultItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileSearchResultItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSearchResultItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
