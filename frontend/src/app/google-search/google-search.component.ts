import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GoogleSearchService } from './google-search.service';
import { MemberLinks } from '../typing';
import { FormControl } from '@angular/forms';

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
  control = new FormControl();

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
    this.control.valueChanges
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((value) => {
        this.candidates = this.keywords.filter((key) =>
          key.includes(value.trim())
        );
      });

    this.googleSearchService
      .getLinks('nogizaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((nogizaka) => {
        this.nogizakaLinks = nogizaka;
        this.cd.markForCheck();
      });
    this.googleSearchService
      .getLinks('sakurazaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((sakurazaka) => {
        this.sakurazakaLinks = sakurazaka;
        this.cd.markForCheck();
      });
    this.googleSearchService
      .getLinks('hinatazaka')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((hinatazaka) => {
        this.hinatazakaLinks = hinatazaka;
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
    const input = this.control.value?.trim();
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

    window.open(query, '_blank');
  }

  clearAll(): void {
    this.targetMembers.length = 0;
    this.cd.markForCheck();
  }

  private removeQueryParams(url: string): string {
    if (!url.includes('?')) {
      return url;
    }
    return url.slice(0, url.indexOf('?'));
  }
}
