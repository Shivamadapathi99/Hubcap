import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedTasksListComponent } from './related-tasks-list.component';

describe('RelatedTasksListComponent', () => {
  let component: RelatedTasksListComponent;
  let fixture: ComponentFixture<RelatedTasksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedTasksListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedTasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
