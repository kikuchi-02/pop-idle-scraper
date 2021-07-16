import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IdleSwitchState, Post } from '../../typing';
import { NewsService } from './news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent implements OnInit, OnDestroy {
  posts: Post[];

  idleSwitchState: IdleSwitchState = {
    nogizakaCheck: true,
    sakurazakaCheck: true,
    hinatazakaCheck: true,
  };

  private nogizakaKoshiki: Post[];
  private sakurazakaKoshiki: Post[];
  private hinatazakaKoshiki: Post[];

  private nogizakaBlog: Post[];
  private sakurazakaBlog: Post[];
  private hinatazakaBlog: Post[];

  private nogizakaTwitter: Post[];
  private sakurazakaTwitter: Post[];
  private hinatazakaTwitter: Post[];

  private siteInitialized$ = new Subject<void>();
  private twitterInitialized$ = new Subject<void>();

  private unsubscriber$ = new Subject<void>();

  constructor(private newsService: NewsService, private cd: ChangeDetectorRef) {
    zip(this.siteInitialized$, this.twitterInitialized$)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(() => {
        this.switchIdle();
      });
    this.getData();
  }

  switchIdle(): void {
    const posts: Post[] = [];
    if (this.idleSwitchState.nogizakaCheck) {
      posts.push(
        ...this.nogizakaKoshiki,
        ...this.nogizakaBlog,
        ...this.nogizakaTwitter
      );
    }
    if (this.idleSwitchState.sakurazakaCheck) {
      posts.push(
        ...this.sakurazakaKoshiki,
        ...this.sakurazakaBlog,
        ...this.sakurazakaTwitter
      );
    }
    if (this.idleSwitchState.hinatazakaCheck) {
      posts.push(
        ...this.hinatazakaKoshiki,
        ...this.hinatazakaBlog,
        ...this.hinatazakaTwitter
      );
    }
    posts.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
    this.posts = posts;
    this.cd.markForCheck();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  private getData(): void {
    this.newsService
      .getSite([
        'nogizaka-koshiki',
        'nogizaka-blog',
        'sakurazaka-koshiki',
        'sakurazaka-blog',
        'hinatazaka-koshiki',
        'hinatazaka-blog',
      ])
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe({
        next: (result) => {
          result.forEach((item) => {
            switch (item.kind) {
              case 'nogizaka-koshiki':
                this.nogizakaKoshiki = item.value?.posts || [];
                break;
              case 'nogizaka-blog':
                this.nogizakaBlog = item.value.posts || [];
                break;
              case 'sakurazaka-koshiki':
                this.sakurazakaKoshiki = item.value?.posts || [];
                break;
              case 'sakurazaka-blog':
                this.sakurazakaBlog = item.value?.posts || [];
                break;
              case 'hinatazaka-koshiki':
                this.hinatazakaKoshiki = item.value?.posts || [];
                break;
              case 'hinatazaka-blog':
                this.hinatazakaBlog = item.value?.posts || [];
                break;
            }
          });
          this.siteInitialized$.next();
        },
      });
    this.newsService
      .getTweets(['nogizaka', 'sakurazaka', 'hinatazaka'])
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe({
        next: (result) => {
          result.forEach((item) => {
            switch (item.kind) {
              case 'nogizaka':
                this.nogizakaTwitter = (item.value?.posts || []).map(
                  (tweet) => {
                    tweet.isTweet = true;
                    return tweet;
                  }
                );
                break;
              case 'sakurazaka':
                this.sakurazakaTwitter = (item.value?.posts || []).map(
                  (tweet) => {
                    tweet.isTweet = true;
                    return tweet;
                  }
                );
                break;
              case 'hinatazaka':
                this.hinatazakaTwitter = (item.value?.posts || []).map(
                  (tweet) => {
                    tweet.isTweet = true;
                    return tweet;
                  }
                );
                break;
            }
          });
          this.twitterInitialized$.next();
        },
      });
  }
}
