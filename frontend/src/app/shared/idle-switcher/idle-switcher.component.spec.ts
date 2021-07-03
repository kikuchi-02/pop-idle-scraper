import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdleSwitcherComponent } from './idle-switcher.component';

describe('IdleSwitcherComponent', () => {
  let component: IdleSwitcherComponent;
  let fixture: ComponentFixture<IdleSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdleSwitcherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdleSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
