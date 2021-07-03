import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { IdleKind, IdleSwitchState } from '../../typing';

@Component({
  selector: 'app-idle-switcher',
  templateUrl: './idle-switcher.component.html',
  styleUrls: ['./idle-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdleSwitcherComponent implements OnInit {
  @Input()
  value: IdleSwitchState;

  @Output()
  changed = new EventEmitter<IdleSwitchState>();

  constructor() {}

  ngOnInit(): void {}

  checkboxChange(event, idle: IdleKind): void {
    switch (idle) {
      case 'nogizaka':
        this.value.nogizakaCheck = event;
        break;
      case 'sakurazaka':
        this.value.sakurazakaCheck = event;
        break;
      case 'hinatazaka':
        this.value.hinatazakaCheck = event;
        break;
      default:
        break;
    }
    this.changed.next(this.value);
  }
}
