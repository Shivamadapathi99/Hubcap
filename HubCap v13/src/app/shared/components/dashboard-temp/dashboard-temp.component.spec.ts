import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTempComponent } from './dashboard-temp.component';

describe('DashboardTempComponent', () => {
  let component: DashboardTempComponent;
  let fixture: ComponentFixture<DashboardTempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardTempComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
