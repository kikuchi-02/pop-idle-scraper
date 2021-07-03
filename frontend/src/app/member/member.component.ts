import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IdleSwitchState, Member } from '../typing';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  constructor(private utilService: UtilService, private cd: ChangeDetectorRef) {
    // this.utilService
    //   .getMembers('nogizaka')
    //   .pipe(takeUntil(this.unsubscriber$))
    //   .subscribe((members) => {
    //     this.nogizakaMembers = members;
    //   });
    // this.utilService
    //   .getMembers('sakurazaka')
    //   .pipe(takeUntil(this.unsubscriber$))
    //   .subscribe((members) => {
    //     this.sakurazakaMembers = members;
    //   });

    // this.utilService
    //   .getMembers('hinatazaka')
    //   .pipe(takeUntil(this.unsubscriber$))
    //   .subscribe((members) => {
    //     this.hinatazakaMembers = members;
    //   });

    this.utilService
      .getMemberTable('nogizaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((tables) => {
        this.nogizakaTables = tables;
        this.cd.markForCheck();
      });

    this.utilService
      .getMemberTable('sakurazaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((tables) => {
        this.sakurazakaTables = tables;
        this.cd.markForCheck();
      });

    this.utilService
      .getMemberTable('hinatazaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((tables) => {
        this.hinatazakaTables = tables;
        this.cd.markForCheck();
      });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubscriber$.next();
  }
}
