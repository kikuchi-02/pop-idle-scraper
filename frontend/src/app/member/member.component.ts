import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IdleSwitchState } from '../typing';
import { MemberService } from './member.service';

interface TableContent {
  columns: string[];
  rows: any[];
}

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

  nogizakaTables: TableContent[];
  sakurazakaTables: TableContent[];
  hinatazakaTables: TableContent[];

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    private memberService: MemberService,
    private cd: ChangeDetectorRef
  ) {
    this.memberService
      .getMemberTable(['nogizaka', 'sakurazaka', 'hinatazaka'])
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((result) => {
        result.forEach((item) => {
          switch (item.kind) {
            case 'nogizaka':
              this.nogizakaTables = item.tables;
              break;
            case 'sakurazaka':
              this.sakurazakaTables = item.tables;
              break;
            case 'hinatazaka':
              this.hinatazakaTables = item.tables;
              break;
          }
        });
        this.cd.markForCheck();
      });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubscriber$.next();
  }

  setWidth(index: number, length: number): string {
    const baseWidth = 120;
    if (index === length - 1) {
      return `calc(100% - ${baseWidth * length - 1}px)`;
    }
    return `${baseWidth}px`;
  }
}
