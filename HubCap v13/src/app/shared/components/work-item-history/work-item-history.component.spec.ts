import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkItemHistoryComponent } from './work-item-history.component';

describe('WorkItemHistoryComponent', () => {
  let component: WorkItemHistoryComponent;
  let fixture: ComponentFixture<WorkItemHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkItemHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkItemHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
