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

@Component({
  selector: 'app-google-search',
  templateUrl: './google-search.component.html',
  styleUrls: ['./google-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleSearchComponent implements OnInit, OnDestroy {
  keywords = '';

  nogizakaLinks: MemberLinks[];
  sakurazakaLinks: MemberLinks[];
  hinatazakaLinks: MemberLinks[];

  targetLinks: MemberLinks[] = [];

  private unsubscriber$ = new Subject<void>();

  constructor(
    private googleSearchService: GoogleSearchService,
    private cd: ChangeDetectorRef
  ) {
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
    const words = this.keywords.trim().split(/\s+/).join('+');
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
}
