import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MemberLinks } from '../typing';
import { GoogleSearchService } from './google-search.service';

interface MemberLinkChecks extends MemberLinks {
  checks: boolean[];
}

@Component({
  selector: 'app-google-search',
  templateUrl: './google-search.component.html',
  styleUrls: ['./google-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleSearchComponent implements OnInit, OnDestroy {
  formGroup = new FormGroup({
    input: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  candidates: string[];

  nogizakaLinks: MemberLinks[];
  sakurazakaLinks: MemberLinks[];
  hinatazakaLinks: MemberLinks[];

  targetMembers: MemberLinkChecks[] = [];

  private unsubscriber$ = new Subject<void>();

  private localStorageKey = 'google-search-candidates';
  get keywords(): string[] {
    const keys = localStorage.getItem(this.localStorageKey);
    return keys ? JSON.parse(keys) : [];
  }
  set keywords(words: string[]) {
    const keys = [...new Set([...words, ...this.keywords])];
    localStorage.setItem(this.localStorageKey, JSON.stringify(keys));
  }

  constructor(
    private googleSearchService: GoogleSearchService,
    private cd: ChangeDetectorRef
  ) {
    this.candidates = this.keywords;

    this.formGroup.controls.input.valueChanges
      .pipe(
        filter((value) => !!value),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((value) => {
        this.candidates = this.keywords.filter((key) =>
          key.includes(value.trim())
        );
      });

    this.googleSearchService
      .getLinks(['nogizaka', 'sakurazaka', 'hinatazaka'])
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((result) => {
        result.forEach((item) => {
          switch (item.kind) {
            case 'nogizaka':
              this.nogizakaLinks = item.value;
              break;
            case 'sakurazaka':
              this.sakurazakaLinks = item.value;
              break;
            case 'hinatazaka':
              this.hinatazakaLinks = item.value;
              break;
          }
        });
        this.cd.markForCheck();
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  changed(check: boolean, member: MemberLinks): void {
    const checks = member as MemberLinkChecks;
    checks.checks = [...Array(checks.links.length)].map(() => true);

    if (check) {
      this.targetMembers.push(checks);
    } else {
      const index = this.targetMembers.findIndex((b) => b.name === member.name);
      if (index >= 0) {
        this.targetMembers.splice(index, 1);
      }
    }
    this.cd.markForCheck();
  }

  isChecked(member: MemberLinks | MemberLinkChecks): boolean {
    return (
      this.targetMembers.findIndex((target) => target.name === member.name) > -1
    );
  }

  submit(): void {
    const input = this.formGroup.controls.input.value?.trim();
    if (!input) {
      alert('enter keyword');
      return;
    }
    this.keywords = [input];

    const words = input.split(/\s+/).map(encodeURIComponent).join('+');
    let query = `https://www.google.com/search?q=${words}`;

    const links = this.targetMembers.reduce((acc, cur) => {
      cur.links.forEach((link, index) => {
        if (cur.checks[index] && !!link) {
          let queryLink: string;
          if (link.includes('?')) {
            queryLink = this.removeQueryParams(link);
            queryLink = `site:${encodeURIComponent(queryLink)}`;
            queryLink = `${encodeURIComponent(cur.name)}+AND+${queryLink}`;
          } else {
            queryLink = `site:${encodeURIComponent(link)}`;
          }
          acc.push(queryLink);
        }
      });
      return acc;
    }, []);
    if (links.length === 1) {
      query += `+${links[0]}`;
    } else {
      const linkQuery = links.join('+OR+');
      query += `+${linkQuery}`;
    }
    const start = this.formGroup.controls.startDate.value;
    if (!!start) {
      query += `+after:${this.dateToString(start)}`;
    }
    const end = this.formGroup.controls.endDate.value;
    if (!!end) {
      query += `+before:${this.dateToString(end)}`;
    }

    window.open(query, '_blank');
  }

  clearAll(): void {
    this.targetMembers.length = 0;
    this.cd.markForCheck();
  }

  dateToString(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  private removeQueryParams(url: string): string {
    if (!url.includes('?')) {
      return url;
    }
    return url.slice(0, url.indexOf('?'));
  }
}
