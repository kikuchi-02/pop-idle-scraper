import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';

import { Post, SiteName } from '../typing';
import { takeUntil } from 'rxjs/operators';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteComponent implements OnInit, OnDestroy {
  @Input() siteName: SiteName;

  siteTitle: string;
  posts: Post[];

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(private utilService: UtilService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.utilService
      .getSite(this.siteName)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((val) => {
        this.posts = val.posts;
        this.siteTitle = val.siteTitle;
        this.cd.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }
}
