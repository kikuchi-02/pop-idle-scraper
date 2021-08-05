import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningBallonComponent } from './warning-ballon.component';

describe('WarningBallonComponent', () => {
  let component: WarningBallonComponent;
  let fixture: ComponentFixture<WarningBallonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarningBallonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningBallonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
