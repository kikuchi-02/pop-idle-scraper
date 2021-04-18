import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IdleKind, Post } from '../typing';
import { TwitterService } from './twitter.service';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss'],
})
export class TwitterComponent implements OnInit, OnDestroy {
  @Input() idle: IdleKind;

  tweets: Post[];
  siteTitle: string;

  private unsubscriber$: Subject<void> = new Subject<void>();
  constructor(private twitterService: TwitterService) {}

  ngOnInit(): void {
    this.twitterService
      .getTweets(this.idle)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((val) => {
        this.tweets = val?.posts;
        this.siteTitle = val?.siteTitle;
      });
  }
  ngOnDestroy() {
    this.unsubscriber$.next();
  }
}
