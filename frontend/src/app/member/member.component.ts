import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IdleSwitchState, Member } from '../typing';
import { MemberService } from './member.service';

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

  constructor(private memberService: MemberService) {
    this.memberService
      .getMembers('nogizaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((members) => {
        this.nogizakaMembers = members;
      });
    this.memberService
      .getMembers('sakurazaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((members) => {
        this.sakurazakaMembers = members;
      });

    this.memberService
      .getMembers('hinatazaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((members) => {
        this.hinatazakaMembers = members;
      });

    // this.memberService
    //   .getMemberTable('nogizaka')
    //   .pipe(takeUntil(this.unsubscriber$))
    //   .subscribe((tables) => {
    //     this.nogizakaTables = tables;
    //   });

    // this.memberService
    //   .getMemberTable('sakurazaka')
    //   .pipe(takeUntil(this.unsubscriber$))
    //   .subscribe((tables) => {
    //     this.sakurazakaTables = tables;
    //   });

    // this.memberService
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
