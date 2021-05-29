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

  targetLinks: MemberLinks[] = [];

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

  changed(event, link: MemberLinks): void {
    if (event.target.checked) {
      this.targetLinks.push(link);
    } else {
      const index = this.targetLinks.findIndex((b) => b.name === link.name);
      if (index >= 0) {
        this.targetLinks.splice(index, 1);
      }
    }
    this.cd.markForCheck();
  }

  submit(): void {
    const input = this.control.value?.trim();
    if (!input) {
      alert('enter keyword');
      return;
    }
    this.keywords = [input];

    const words = input.split(/\s+/).join('+');
    let query = `https://www.google.com/search?q=${words}`;

    if (
      this.targetLinks.length === 1 &&
      this.targetLinks[0].links.length === 1
    ) {
      query += `+site:${this.targetLinks[0].links[0]}`;
    } else if (this.targetLinks.length > 0) {
      const linkQuery = this.targetLinks
        .map((member) => member.links.map((l) => `site:${l}`))
        .flat()
        .join('+OR+');
      query += `+(${linkQuery})`;
    }

    window.open(query, '_blank');
  }

  clearAll(): void {
    window.location.reload();
  }
}
