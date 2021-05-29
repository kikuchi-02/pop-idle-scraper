import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Magazine } from '../typing';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-magazine',
  templateUrl: './magazine.component.html',
  styleUrls: ['./magazine.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagazineComponent implements OnInit, OnDestroy {
  magazineGroups: Magazine[][];
  targetDate: string;
  dateSubject$ = new Subject<string>();

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(private utilService: UtilService, private cd: ChangeDetectorRef) {
    this.dateSubject$
      .pipe(
        distinctUntilChanged(),
        switchMap((targetDate) => this.utilService.getMagazines(targetDate)),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((magazineGroups) => {
        this.magazineGroups = magazineGroups;
        this.cd.markForCheck();
      });
  }

  @Input() set date(d: string | Date | number) {
    const target = new Date(d);
    this.targetDate = this.dateToString(target);
    this.dateSubject$.next(this.targetDate);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  dateToString(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
}
