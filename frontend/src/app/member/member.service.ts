import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IdleKind, MemberLinks } from '../typing';

interface TableContent {
  columns: string[];
  rows: any[];
}

interface BulkIdleResult {
  kind: IdleKind;
  value: object[][];
  tables?: TableContent[];
}

interface BulkIdleLink {
  kind: IdleKind;
  value: MemberLinks[];
}

@Injectable({ providedIn: 'root' })
export class MemberService {
  constructor(private http: HttpClient) {}

  getLinks(idles: IdleKind[]): Observable<BulkIdleLink[]> {
    const query = idles.map((site) => `kind[]=${site}`).join('&');
    return this.http.get<BulkIdleLink[]>(`api/v1/member-links?${query}`);
  }

  getMemberTable(idles: IdleKind[]): Observable<BulkIdleResult[]> {
    const query = idles.map((site) => `kind[]=${site}`).join('&');
    return forkJoin([
      this.getLinks(idles),
      this.http.get<BulkIdleResult[]>(`api/v1/member-table?${query}`),
    ]).pipe(
      map(([linkResult, tableResult]) => {
        const links: {
          [kind: string]: { [name: string]: string[] };
        } = linkResult.reduce((linkAcc, result) => {
          linkAcc[result.kind] = result.value.reduce((memberAcc, member) => {
            memberAcc[member.name] = member.links;
            return memberAcc;
          }, {});
          return linkAcc;
        }, {});

        const res = tableResult.map((item) => {
          const idleLinks = links[item.kind];
          item.tables = item.value.map((table) =>
            this.parseTable(table, idleLinks)
          );
          return item;
        });
        return res;
      }),
      catchError((err) => {
        console.error(err);
        return of(undefined);
      })
    );
  }

  private parseTable(
    table: object[],
    links: { [name: string]: string[] }
  ): TableContent {
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
        if (column === 'link') {
          const targetLinks = new Set<string>();
          if (links[row['名前']]) {
            links[row['名前']].forEach((l) => targetLinks.add(l));
          }
          if (row[column]) {
            targetLinks.add(row[column]);
          }

          row[column] = Array.from(targetLinks).map((link) => {
            const url = new URL(link);
            return { host: url.host, link };
          });
        }
        return column;
      });
      return row;
    });

    return { columns, rows: table };
  }
}
