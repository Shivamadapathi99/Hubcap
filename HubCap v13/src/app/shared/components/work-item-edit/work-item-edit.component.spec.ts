import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkItemEditComponent } from './work-item-edit.component';

describe('WorkItemEditComponent', () => {
  let component: WorkItemEditComponent;
  let fixture: ComponentFixture<WorkItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkItemEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
