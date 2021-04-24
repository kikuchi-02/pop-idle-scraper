import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(private utilService: UtilService, private cd: ChangeDetectorRef) {
    this.utilService
      .getMagazines()
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((magazineGroups) => {
        this.magazineGroups = magazineGroups;
        this.cd.markForCheck();
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }
}
