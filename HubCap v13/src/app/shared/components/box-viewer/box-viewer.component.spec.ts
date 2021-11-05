import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxViewerComponent } from './box-viewer.component';

describe('BoxViewerComponent', () => {
  let component: BoxViewerComponent;
  let fixture: ComponentFixture<BoxViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
