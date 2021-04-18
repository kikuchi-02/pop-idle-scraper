import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { Post, SiteName } from '../typing';
import { takeUntil } from 'rxjs/operators';
import { SiteService } from './site.service';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
})
export class SiteComponent implements OnInit, OnDestroy {
  @Input() siteName: SiteName;

  siteTitle: string;
  posts: Post[];

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.siteService
      .getSite(this.siteName)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((val) => {
        this.posts = val.posts;
        this.siteTitle = val.siteTitle;
      });
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
  }
}
