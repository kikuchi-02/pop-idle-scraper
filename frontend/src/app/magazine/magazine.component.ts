import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
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
  // magazineGroups: Magazine[][];
  mmm: Magazine[][];
  set magazineGroups(m: Magazine[][]) {
    console.log('mmmm', m);
    this.mmm = m;
  }
  get magazineGroups(): Magazine[][] {
    console.log('get', this.mmm);
    return this.mmm;
  }

  dateSubject$ = new ReplaySubject<Date>();

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(private utilService: UtilService, private cd: ChangeDetectorRef) {
    this.dateSubject$
      .pipe(
        distinctUntilChanged(),
        switchMap((targetDate) => {
          const dateString = this.dateToString(targetDate);
          return this.utilService.getMagazines(dateString);
        }),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((magazineGroups) => {
        this.magazineGroups = magazineGroups;
        this.cd.markForCheck();
      });
  }

  @Input() set date(d: string | Date | number) {
    if (!d) {
      return;
    }
    const target = new Date(d);
    this.dateSubject$.next(target);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  dateToString(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  notPublished(groups: Magazine[][]): boolean {
    return !!groups && groups.every((group) => group.length === 0);
  }
}
