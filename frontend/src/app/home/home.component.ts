import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  today = new Date();
  dates = [...Array(7)].map((_, i) => {
    const copied = new Date(this.today.getTime());
    copied.setDate(copied.getDate() - i);
    return copied;
  });
  selectedDate: Date;

  constructor() {}

  selectDate(d): void {
    this.selectedDate = d.value;
  }

  ngOnInit(): void {}
}
