import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IdleSwitchState } from '../typing';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  idleSwitchState: IdleSwitchState = {
    nogizakaCheck: true,
    sakurazakaCheck: true,
    hinatazakaCheck: true,
  };

  constructor() {}

  ngOnInit(): void {}
}
