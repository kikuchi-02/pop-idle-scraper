import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IdleSwitchState } from '../typing';

@Component({
  selector: 'app-idle-switcher',
  templateUrl: './idle-switcher.component.html',
  styleUrls: ['./idle-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdleSwitcherComponent implements OnInit {
  @Input()
  value: IdleSwitchState;

  constructor() {}

  ngOnInit(): void {}
}
