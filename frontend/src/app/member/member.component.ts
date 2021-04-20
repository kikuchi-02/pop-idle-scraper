import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IdleSwitchState, Member } from '../typing';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
})
export class MemberComponent implements OnInit, OnDestroy {
  idleSwitchState: IdleSwitchState = {
    nogizakaCheck: true,
    sakurazakaCheck: true,
    hinatazakaCheck: true,
  };

  nogizakaMembers: Member[];
  sakurazakaMembers: Member[];
  hinatazakaMembers: Member[];

  nogizakaTables: string[];
  sakurazakaTables: string[];
  hinatazakaTables: string[];

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(private utilService: UtilService) {
    this.utilService
      .getMembers('nogizaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((members) => {
        this.nogizakaMembers = members;
      });
    this.utilService
      .getMembers('sakurazaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((members) => {
        this.sakurazakaMembers = members;
      });

    this.utilService
      .getMembers('hinatazaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((members) => {
        this.hinatazakaMembers = members;
      });

    // this.utilService
    //   .getMemberTable('nogizaka')
    //   .pipe(takeUntil(this.unsubscriber$))
    //   .subscribe((tables) => {
    //     this.nogizakaTables = tables;
    //   });

    // this.utilService
    //   .getMemberTable('sakurazaka')
    //   .pipe(takeUntil(this.unsubscriber$))
    //   .subscribe((tables) => {
    //     this.sakurazakaTables = tables;
    //   });

    // this.utilService
    //   .getMemberTable('hinatazaka')
    //   .pipe(takeUntil(this.unsubscriber$))
    //   .subscribe((tables) => {
    //     this.hinatazakaTables = tables;
    //   });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubscriber$.next();
  }
}
