import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Magazine } from '../typing';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-magazine',
  templateUrl: './magazine.component.html',
  styleUrls: ['./magazine.component.scss'],
})
export class MagazineComponent implements OnInit, OnDestroy {
  magazineGroups: Magazine[][];

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(private utilService: UtilService) {
    this.utilService
      .getMagazines()
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((magazineGroups) => {
        console.log(magazineGroups)
        this.magazineGroups = magazineGroups;
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }
}
