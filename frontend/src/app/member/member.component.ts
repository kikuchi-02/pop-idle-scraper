import { formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilService } from '../services/util.service';
import { IdleSwitchState } from '../typing';

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

  constructor(private utilService: UtilService, private cd: ChangeDetectorRef) {
    this.utilService
      .getMemberTable('nogizaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((tables) => {
        this.nogizakaTables = tables.map(this.parseTable.bind(this));
        this.cd.markForCheck();
      });

    this.utilService
      .getMemberTable('sakurazaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((tables) => {
        this.sakurazakaTables = tables.map(this.parseTable.bind(this));
        this.cd.markForCheck();
      });

    this.utilService
      .getMemberTable('hinatazaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((tables) => {
        this.hinatazakaTables = tables.map(this.parseTable.bind(this));
        this.cd.markForCheck();
      });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubscriber$.next();
  }

  parseTable(table: object[]): TableContent {
    const columnArray = table.map((row) => Object.keys(row));
    let columnMaxLength = 0;
    let columns: string[];
    for (const currentColumn of columnArray) {
      if (currentColumn.length > columnMaxLength) {
        columns = currentColumn;
        columnMaxLength = currentColumn.length;
      }
    }
    columns = columns.filter((col) => !['備考', 'よみ'].includes(col));

    table = table.map((row) => {
      columns = columns.map((column) => {
        try {
          const date = new Date(row[column]);
          if (date instanceof Date) {
            row[column] = formatDate(date, 'y/M/d', 'en-US');
          }
        } catch (e) {}
        if (column === '出身地') {
          if (/^\d{1,2}.+$/.test(row[column])) {
            row[column] = row[column].replace(/^\d{1,2}(.+)$/, (match, p) => p);
          }
        }
        return column;
      });
      return row;
    });
    debugger;

    return { columns, rows: table };
  }
}
