import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxLoginManagerComponent } from './box-login-manager.component';

describe('BoxLoginManagerComponent', () => {
  let component: BoxLoginManagerComponent;
  let fixture: ComponentFixture<BoxLoginManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxLoginManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxLoginManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
