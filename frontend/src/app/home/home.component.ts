import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  today = new Date();
  dates = [...Array(5)].map((_, i) =>
    this.today.setDate(this.today.getDate() - i)
  );

  constructor() {}

  ngOnInit(): void {}
}
