import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxEditFilenameComponent } from './box-edit-filename.component';

describe('BoxEditFilenameComponent', () => {
  let component: BoxEditFilenameComponent;
  let fixture: ComponentFixture<BoxEditFilenameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxEditFilenameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxEditFilenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
