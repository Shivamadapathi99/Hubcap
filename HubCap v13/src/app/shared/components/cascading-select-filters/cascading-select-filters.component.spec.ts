import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CascadingSelectFiltersComponent } from './cascading-select-filters.component';

describe('CascadingSelectFiltersComponent', () => {
  let component: CascadingSelectFiltersComponent;
  let fixture: ComponentFixture<CascadingSelectFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CascadingSelectFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CascadingSelectFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
